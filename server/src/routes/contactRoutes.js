// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',                ctrl.sendMessage);                        // Public
router.get('/',                 protect, adminOnly, ctrl.getMessages);    // Admin
router.patch('/:id/read',       protect, adminOnly, ctrl.markAsRead);     // Admin
router.post('/:id/reply',       protect, adminOnly, ctrl.replyToMessage); // Admin ← NEW
router.delete('/:id',           protect, adminOnly, ctrl.deleteMessage);  // Admin

module.exports = router;