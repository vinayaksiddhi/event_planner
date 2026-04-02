const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ==============================
// ✅ MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// ✅ DATABASE
// ==============================
mongoose
  .connect("mongodb://127.0.0.1:27017/event_planner")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ==============================
// ✅ ROUTES
// ==============================
const certificateRoutes = require("./routes/certificateRoute");
app.use("/api/certificates", certificateRoutes);

// ==============================
// ✅ DEFAULT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 API running...");
});

// ==============================
// ✅ SERVER START
// ==============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});