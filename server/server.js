/**
 * server.js
 * Works for both:
 * - Local dev: starts HTTP server with app.listen()
 * - Vercel serverless: exports app directly
 */

const app        = require('./src/app');
const connectDB  = require('./src/config/db');
const dotenv     = require('dotenv');

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// Only start server if NOT running on Vercel
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

// Export for Vercel serverless
module.exports = app;