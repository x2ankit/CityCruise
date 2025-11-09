require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");

connectToDb(); // ✅ connect database

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // change later when deployed
  credentials: true
}));
app.use(cookieParser());

app.use("/users", require("./routes/userRoutes"));
app.use("/captains", require("./routes/captainRoutes"));
app.use("/rides", require("./routes/rideRoutes"));
app.use("/maps", require("./routes/mapsRoutes"));

app.get("/", (req, res) => {
  res.send("✅ Backend Running Successfully");
});

module.exports = app;
