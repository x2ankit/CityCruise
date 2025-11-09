const mongoose = require('mongoose');
require("dotenv").config(); // load .env when running locally

/**
 * Connect to MongoDB with simple retry/backoff logic.
 * This helps transient network issues and gives a clearer log when Atlas blocks the connection
 * (for example when the deployment's outbound IP isn't whitelisted).
 */
const connectToDb = async (opts = {}) => {
  const maxAttempts = opts.maxAttempts || 5;
  const baseDelay = opts.baseDelayMs || 2000; // 2s

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("✅ MongoDB Connected");
      return;
    } catch (error) {
      // Provide a helpful hint for Atlas whitelist errors
      const msg = error && error.message ? error.message : String(error);
      console.log(`❌ MongoDB connection attempt ${attempt} failed: ${msg}`);

      if (/whitelist|IP|ip address|authentication failed/i.test(msg)) {
        console.log("ℹ️ Hint: This error often means your MongoDB Atlas project is blocking connections from this host.\n" +
          " - Add your host's outbound IP(s) to Atlas Network Access (Access List) OR\n" +
          " - Temporarily allow 0.0.0.0/0 for testing (not recommended for production) OR\n" +
          " - Use Atlas Private Endpoint / VPC peering for production setups.");
      }

      if (attempt === maxAttempts) {
        console.log("❌ All MongoDB connection attempts failed. Exiting process.");
        // Optionally exit the process so the host can restart the service and surface the failure.
        // In containerized deployments it's often better to crash and let the platform restart.
        process.exit(1);
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${Math.round(delay / 1000)}s...`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

module.exports = connectToDb;
