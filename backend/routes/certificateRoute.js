const express = require("express");
const router = express.Router();

const Certificate = require("../models/Certificate");

// ==============================
// 📤 UPLOAD CERTIFICATE (UPDATED)
// ==============================
router.post("/upload", async (req, res) => {
  try {
    const { email, eventId, file } = req.body;

    if (!email || !eventId || !file) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const cert = new Certificate({
      email,
      eventId,
      file, // 🔥 now storing URL
    });

    await cert.save();

    res.json({
      message: "✅ Certificate uploaded",
      cert,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ==============================
// 📥 GET ALL CERTIFICATES
// ==============================
router.get("/", async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ date: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching" });
  }
});

// ==============================
// 📥 GET USER CERTIFICATES
// ==============================
router.get("/user/:email", async (req, res) => {
  try {
    const certs = await Certificate.find({
      email: req.params.email,
    });

    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user certs" });
  }
});

// ==============================
// ❌ DELETE CERTIFICATE
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;