const mongoose = require('mongoose');
require("dotenv").config(); // ✅ required to load .env

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {    // ✅ correct variable name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(`❌ MongoDB Error: ${error.message}`);
  }
};

module.exports = connectToDb;
