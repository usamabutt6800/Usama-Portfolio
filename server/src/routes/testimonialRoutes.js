// routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/', ctrl.getAllTestimonials);
router.post('/', protect, adminOnly, ctrl.createTestimonial);
router.put('/:id', protect, adminOnly, ctrl.updateTestimonial);
router.delete('/:id', protect, adminOnly, ctrl.deleteTestimonial);
module.exports = router;
