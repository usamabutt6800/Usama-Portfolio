// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', ctrl.getAllBlogs);
router.get('/:slug', ctrl.getBlog);
router.post('/', protect, adminOnly, upload.single('coverImage'), ctrl.createBlog);
router.put('/:slug', protect, adminOnly, upload.single('coverImage'), ctrl.updateBlog);
router.delete('/:id', protect, adminOnly, ctrl.deleteBlog);
module.exports = router;
