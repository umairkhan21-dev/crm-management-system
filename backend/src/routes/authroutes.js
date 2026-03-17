const express = require("express");
const router = express.Router();
const User = require("../models/user");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/authcontroller");
const auth = require("../middleware/authmiddleware");
const roleCheck = require("../middleware/rolemiddleware");

router.post("/login", loginUser);

// Main admin-only route for creating users from the frontend.
router.post("/create", auth, roleCheck(["admin"]), registerUser);

// Keep the old route working so existing screens do not break.
router.post("/staff", auth, roleCheck(["admin"]), registerUser);

router.get("/user", auth, getUser);

// Used by the tickets screen to list assignable users.
router.get("/all", auth, async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
