// Load env variables
require("dotenv").config();

const http = require("http");
const app = require("./app");
const { initializeSocket } = require("./socket");

// Use PORT from .env or default to 4001
const port = process.env.PORT || 4001;

// Create HTTP server with Express app
const server = http.createServer(app);

// Initialize Socket.io on this server
initializeSocket(server);

// Start server
server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
