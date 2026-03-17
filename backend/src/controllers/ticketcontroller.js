
const Ticket = require('../models/ticket');

exports.addTicket = async (req, res) => {
    try {
        if(req.body.assignedTo === ""){
            req.body.assignedTo = null;
        }

        const ticket = new Ticket({...req.body,
          activity: [
            {
              action:"Ticket Created",
              by: req.user.id
            }
          ]
        });
        await ticket.save();

        res.status(201).json({ message: "ticket created", ticket });

    } catch (err) {
        console.error("ticket creation error:", err); 
        res.status(500).json({ message: "failed to create ticket", error: err.message });
    }
};


exports.getTickets = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "staff") {
      filter.assignedTo = req.user.id;
    }
    const tickets = await Ticket.find(filter)
      .populate("employeeId", "name email")
      .populate("assignedTo", "name email");

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch tickets",
      error: err.message,
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (
      req.user.role === "staff" &&
      ticket.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    Object.assign(ticket, req.body);
    ticket.activity.push({
      action: "Ticket Updated",
      by: req.user.id,
      at: new Date()
    });
    await ticket.save();
    res.json({ message: "Ticket updated", ticket });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update ticket",
      error: err.message
    });
  }
};

exports.deleteTicket = async(req,res)=>{
    try{
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({message:"ticket deleted"})
    } catch(err){
        res.status(500).json({message:"failed to delete ticket",err:err.message})
    }
};
