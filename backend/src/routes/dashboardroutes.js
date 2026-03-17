const express = require("express")
const router = express.Router("router");

const Employee = require('../models/employee');
const Leads = require('../models/lead');
const Ticket = require('../models/ticket');

router.get('/stats',async(req,res)=>{
    try{
        const totalEmployee = await Employee.countDocuments();
        const totalLeads = await Leads.countDocuments();
        const openTickets = await Ticket.countDocuments({status:"open"});
        const inProgressTickets = await Ticket.countDocuments({status:"In progress"});

        res.json({
            totalEmployee,
            totalLeads,
            openTickets,
            inProgressTickets
        });
    }catch(err){
        res.status(500).json({error:err.message})
    }
});
module.exports = router;