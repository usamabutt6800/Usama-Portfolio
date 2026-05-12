// routes/experienceRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/experienceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.get('/', ctrl.getAllExperiences);
router.post('/', protect, adminOnly, ctrl.createExperience);
router.put('/:id', protect, adminOnly, ctrl.updateExperience);
router.delete('/:id', protect, adminOnly, ctrl.deleteExperience);
module.exports = router;
