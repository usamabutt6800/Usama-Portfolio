/**
 * controllers/authController.js
 * Handles admin login, logout, and token management
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');

// ─── Generate JWT Token ───────────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Set Cookie ───────────────────────────────────────────────────────────────
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,           // Cannot be accessed by JS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  sendSuccess(res, 200, 'Login successful', {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
exports.logout = catchAsync(async (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  sendSuccess(res, 200, 'Logged out successfully');
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  sendSuccess(res, 200, 'User retrieved', { user });
});

// ─── POST /api/auth/setup (One-time admin setup) ──────────────────────────────
exports.setupAdmin = catchAsync(async (req, res, next) => {
  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    return next(new AppError('Admin account already exists', 400));
  }

  const admin = await User.create({
    name: req.body.name || 'Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
  });

  const token = generateToken(admin._id);
  setTokenCookie(res, token);

  sendSuccess(res, 201, 'Admin account created', {
    token,
    user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
});
