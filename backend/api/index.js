// Vercel serverless function
require('dotenv').config();

// Import the Express app from server.js
const app = require('../server');

// Export the app as a serverless function for Vercel
module.exports = app;
