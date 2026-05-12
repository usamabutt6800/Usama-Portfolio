/**
 * utils/errorHandler.js
 * Custom error class and async wrapper
 */

// ─── Custom API Error Class ───────────────────────────────────────────────────
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Known errors vs programming bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Async wrapper: Eliminates try-catch boilerplate in controllers ───────────
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ─── Send success response ────────────────────────────────────────────────────
const sendSuccess = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

module.exports = { AppError, catchAsync, sendSuccess };
