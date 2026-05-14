/**
 * server.js — Works locally AND on Vercel serverless
 */
require('dotenv').config();

const app       = require('./src/app');
const connectDB = require('./src/config/db');

// Track connection state (important for Vercel — reuses connections)
let dbConnected = false;

const connectOnce = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// ─── Local Development ────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectOnce().then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  }).catch(err => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
}

// ─── Vercel Serverless Handler ────────────────────────────────────────────────
// Vercel calls this function for every request
module.exports = async (req, res) => {
  await connectOnce();
  return app(req, res);
};