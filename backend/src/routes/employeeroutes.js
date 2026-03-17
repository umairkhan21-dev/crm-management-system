const express = require("express");
const router = express.Router();
const roleCheck = require("../middleware/rolemiddleware")
const auth = require("../middleware/authmiddleware")
const {
    addEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeecontroller');

router.post('/add',auth,roleCheck(["admin"]),addEmployee);

router.get('/', auth, getEmployees);
router.put('/update/:id', auth, roleCheck(["admin"]),updateEmployee);
router.delete('/delete/:id',auth, roleCheck(["admin"]), deleteEmployee);

module.exports = router;
