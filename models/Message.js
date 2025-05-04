const mongoose = require("mongoose");

// Assuming you have a User model
const User = require("../models/User"); // Adjust the path based on where your User model is located

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// This will create a model called 'Message' from the messageSchema
module.exports = mongoose.model("Message", messageSchema);

