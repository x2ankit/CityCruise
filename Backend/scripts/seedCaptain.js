require("dotenv").config();
const mongoose = require("mongoose");
const Captain = require("../models/captainModel");
const bcrypt = require("bcrypt");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const email = "captain@example.com";
    const password = "captain123";

    await Captain.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const captain = await Captain.create({
      fullname: {
        firstname: "Driver",
        lastname: "One"
      },
      email,
      password: hashedPassword,
      vehicle: {
        vehicleType: "car",   // ✅ required
        color: "white",       // ✅ required
        capacity: 4,          // ✅ required
        plate: "OD-05-1234"
      }
    });

    console.log("✅ Captain Created Successfully");
    console.log("👉 Login Credentials:");
    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log("❌ Seed Error:", err);
    process.exit(1);
  }
})();
