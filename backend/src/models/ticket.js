const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Low"
    },
    status:{
        type:String,
        enum:["open","In progress","Closed"],
        default:"open"
    },
    message:{
        type:String
    },
    activity: [
        {
            action: String,
            by: {type: mongoose.Schema.Types.ObjectId , ref:"User"},
            at: {type: Date, default:Date.now}
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now,
    }
});
module.exports = mongoose.model("Ticket",ticketSchema);
