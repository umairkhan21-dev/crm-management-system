const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String
  },

  phone: {
    type: String
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  source: {
    type: String,
    enum: ["website", "instagram", "facebook", "referral", "cold-call", "others"],
    default: "others"
  },

  status: {
    type: String,
    enum: ["New", "Contacted", "Interested", "Hot", "Warm", "Cold", "Converted", "Lost"],
    default: "New"
  },

  notes: {
    type: String
  },
  activity: [
          {
              action: String,
              by: {type: mongoose.Schema.Types.ObjectId , ref:"User"},
              at: {type: Date, default:Date.now}
          }
      ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lead", leadSchema);
