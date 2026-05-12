/**
 * controllers/blogController.js
 */
const Blog = require('../models/Blog');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');
const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/uploadMiddleware');

exports.getAllBlogs = catchAsync(async (req, res) => {
  const { published } = req.query;
  const filter = {};
  // Public users only see published posts
  if (!req.user) filter.published = true;
  else if (published === 'true') filter.published = true;

  const blogs = await Blog.find(filter).sort({ createdAt: -1 }).select('-content');
  sendSuccess(res, 200, 'Blogs retrieved', { blogs });
});

exports.getBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) return next(new AppError('Blog post not found', 404));
  // Increment views
  blog.views += 1;
  await blog.save({ validateBeforeSave: false });
  sendSuccess(res, 200, 'Blog retrieved', { blog });
});

exports.createBlog = catchAsync(async (req, res) => {
  const blogData = { ...req.body };
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/blogs');
    blogData.coverImage = { url: result.secure_url, publicId: result.public_id };
  }
  const blog = await Blog.create(blogData);
  sendSuccess(res, 201, 'Blog created', { blog });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) return next(new AppError('Blog not found', 404));
  const updateData = { ...req.body };
  if (req.file) {
    if (blog.coverImage?.publicId) await deleteFromCloudinary(blog.coverImage.publicId);
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/blogs');
    updateData.coverImage = { url: result.secure_url, publicId: result.public_id };
  }
  const updated = await Blog.findByIdAndUpdate(blog._id, updateData, { new: true });
  sendSuccess(res, 200, 'Blog updated', { blog: updated });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError('Blog not found', 404));
  if (blog.coverImage?.publicId) await deleteFromCloudinary(blog.coverImage.publicId);
  sendSuccess(res, 200, 'Blog deleted');
});
