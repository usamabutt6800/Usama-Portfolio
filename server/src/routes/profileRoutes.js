// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/profileController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
router.get('/', ctrl.getProfile);
router.put('/', protect, adminOnly, upload.single('avatar'), ctrl.updateProfile);
module.exports = router;
