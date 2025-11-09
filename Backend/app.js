require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");

connectToDb(); // ✅ connect database

const app = express();

app.use(express.json());
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_URL, // configurable via .env FRONTEND_URL
  credentials: true
}));
app.use(cookieParser());

app.use("/users", require("./routes/userRoutes"));
app.use("/captains", require("./routes/captainRoutes"));
app.use("/rides", require("./routes/rideRoutes"));
app.use("/maps", require("./routes/mapsRoutes"));
app.use("/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("✅ Backend Running Successfully");
});

// Health endpoint for readiness/liveness checks
const mongoose = require('mongoose');
app.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
    return res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      dbState,
      env: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
});

// Simple request logger (replace with morgan/winston for production)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Error handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
