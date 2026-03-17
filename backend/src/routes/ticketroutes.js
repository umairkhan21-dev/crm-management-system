const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const {
    addTicket,
    getTickets,
    updateTicket,
    deleteTicket
} = require("../controllers/ticketcontroller");

router.post("/add",auth,addTicket);
router.get("/",auth,getTickets);
router.put("/update/:id",auth,updateTicket);
router.delete("/delete/:id",auth,deleteTicket);

module.exports = router;
