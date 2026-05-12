// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { getAllProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/', protect, adminOnly, upload.single('thumbnail'), createProject);
router.put('/:id', protect, adminOnly, upload.single('thumbnail'), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;
