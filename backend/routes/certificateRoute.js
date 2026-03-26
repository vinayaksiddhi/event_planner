const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Certificate = require("../models/Certificate");

// ==============================
// 📦 STORAGE CONFIG
// ==============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// ==============================
// 📁 FILE FILTER
// ==============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/Image allowed"), false);
  }
};

// ==============================
// 🚀 MULTER SETUP
// ==============================
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// ==============================
// 📤 UPLOAD CERTIFICATE
// ==============================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { email, eventId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const cert = new Certificate({
      email,
      eventId,
      file: req.file.filename,
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