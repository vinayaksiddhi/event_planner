const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ IMPORT ROUTE (FIXED NAME)
const certificateRoutes = require("./routes/certificateRoute");

// ==============================
// ✅ MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// ✅ STATIC FOLDER (UPLOADS)
// ==============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// ✅ DATABASE CONNECTION
// ==============================
mongoose
  .connect("mongodb://127.0.0.1:27017/event_planner")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ==============================
// ✅ ROUTES
// ==============================
app.use("/api/certificates", certificateRoutes);

// ==============================
// ✅ DEFAULT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ==============================
// ✅ SERVER START
// ==============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});