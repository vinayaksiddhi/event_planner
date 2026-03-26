const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  email: String,
  eventId: String,
  file: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Certificate", certificateSchema);