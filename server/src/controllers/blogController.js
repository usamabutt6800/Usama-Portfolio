/**
 * controllers/blogController.js
 * Images stored as Base64 in MongoDB
 */
const Blog = require('../models/Blog');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');
const { bufferToBase64 } = require('../middleware/uploadMiddleware');

exports.getAllBlogs = catchAsync(async (req, res) => {
  const filter = req.user ? {} : { published: true };
  const blogs = await Blog.find(filter).sort({ createdAt: -1 }).select('-content');
  sendSuccess(res, 200, 'Blogs retrieved', { blogs });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) return next(new AppError('Blog post not found', 404));
  blog.views += 1;
  await blog.save({ validateBeforeSave: false });
  sendSuccess(res, 200, 'Blog retrieved', { blog });
});

exports.createBlog = catchAsync(async (req, res) => {
  const blogData = { ...req.body };
  if (req.file) {
    const base64Url = bufferToBase64(req.file.buffer, req.file.mimetype);
    blogData.coverImage = { url: base64Url, publicId: `base64_blog_${Date.now()}` };
  }
  const blog = await Blog.create(blogData);
  sendSuccess(res, 201, 'Blog created', { blog });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) return next(new AppError('Blog not found', 404));
  const updateData = { ...req.body };
  if (req.file) {
    const base64Url = bufferToBase64(req.file.buffer, req.file.mimetype);
    updateData.coverImage = { url: base64Url, publicId: `base64_blog_${Date.now()}` };
  }
  const updated = await Blog.findByIdAndUpdate(blog._id, updateData, { new: true });
  sendSuccess(res, 200, 'Blog updated', { blog: updated });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError('Blog not found', 404));
  sendSuccess(res, 200, 'Blog deleted');
});