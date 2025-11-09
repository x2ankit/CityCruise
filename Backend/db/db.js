const mongoose = require('mongoose');
require("dotenv").config(); // ✅ required to load .env

const connectToDb = async () => {
  try {
    // Mongoose 6+ doesn't require useNewUrlParser/useUnifiedTopology; remove options to avoid deprecation warnings
    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(`❌ MongoDB Error: ${error.message}`);
  }
};

module.exports = connectToDb;
