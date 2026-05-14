/**
 * server.js - Works for local dev AND Vercel serverless
 */
const app       = require('./src/app');
const connectDB = require('./src/config/db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Local development only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

// Required for Vercel serverless
module.exports = app;