// Backend/scripts/seedUser.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");

    const email = "ankit@example.com";
    const password = "ankit123";

    await User.deleteOne({ email }); // delete existing if exists

    const user = await User.create({
      fullname: { firstname: "Ankit", lastname: "Tripathy" },
      email,
      password // password will be hashed by userModel.js pre("save")
    });

    console.log("✅ User Created Successfully");
    console.log("Login with:");
    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log("❌ Seeding Error:", err);
    process.exit(1);
  }
})();
