const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
    },
    file: {
      type: String, // 🔥 now URL
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);