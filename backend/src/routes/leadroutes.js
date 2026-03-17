const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware")
const {
    addLead,
    getLeads,
    updateLead,
    deleteLead
} = require('../controllers/leadcontroller');

router.post('/add',auth, addLead);
router.get('/',auth, getLeads);
router.put('/update/:id',auth, updateLead);
router.delete('/delete/:id', deleteLead);

module.exports = router;
