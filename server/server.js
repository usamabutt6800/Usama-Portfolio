/**
 * server.js
 * Vercel serverless + local dev compatible
 */
require('dotenv').config();
const app      = require('./src/app');
const connectDB = require('./src/config/db');

// Connect MongoDB once
let isConnected = false;
const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// For Vercel serverless — connect before handling request
const handler = async (req, res) => {
  await ensureDB();
  return app(req, res);
};

// Local development
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  ensureDB().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  });
}

module.exports = handler;