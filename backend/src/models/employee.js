const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    company:{
        type:String
    },
    notes:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model("Employee", employeeSchema);