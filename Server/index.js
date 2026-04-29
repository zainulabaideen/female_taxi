require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import models to initialize tables on startup
require("./models/Users");

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://shego.pk",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ───────────────────────────────────────────────────────────────────
const authRoutes    = require("./routes/authRoutes");
const driverRoutes  = require("./routes/driverRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reportRoutes  = require("./routes/reportRoutes");
const adminRoutes   = require("./routes/adminRoutes");

app.use("/api/auth",     authRoutes);
app.use("/api/drivers",  driverRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reports",  reportRoutes);
app.use("/api/admin",    adminRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SHEGO API is running", time: new Date().toISOString() });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  if (err.message === "Only JPEG/PNG/WebP images are allowed") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error" });
});

// ─── Server ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4343;
app.listen(PORT, () => {
  console.log(`\n🚀 SHEGO API running on http://localhost:${PORT}`);
  console.log(`📡 Routes: /api/auth | /api/drivers | /api/bookings | /api/reports | /api/admin`);
});