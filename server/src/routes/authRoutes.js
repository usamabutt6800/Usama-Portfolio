// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, logout, getMe, setupAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/setup', setupAdmin); // Run once to create admin

module.exports = router;
