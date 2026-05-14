/**
 * controllers/projectController.js
 * Images stored as Base64 in MongoDB — no Cloudinary needed
 */

const Project = require('../models/Project');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// ─── Parse techStack ──────────────────────────────────────────────────────────
const parseTechStack = (techStack) => {
  if (!techStack) return [];
  if (Array.isArray(techStack)) return techStack;
  try {
    const parsed = JSON.parse(techStack);
    if (Array.isArray(parsed)) return parsed.map(t => t.trim()).filter(Boolean);
  } catch { /* fall through */ }
  return techStack.split(',').map(t => t.trim()).filter(Boolean);
};

// ─── GET /api/projects ────────────────────────────────────────────────────────
exports.getAllProjects = catchAsync(async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (featured === 'true') filter.featured = true;

  const projects = await Project.find(filter)
    .sort({ featured: -1, order: 1, createdAt: -1 });

  sendSuccess(res, 200, 'Projects retrieved', { count: projects.length, projects });
});

// ─── GET /api/projects/:id ────────────────────────────────────────────────────
exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError('Project not found', 404));
  sendSuccess(res, 200, 'Project retrieved', { project });
});

// ─── POST /api/projects ───────────────────────────────────────────────────────
exports.createProject = catchAsync(async (req, res) => {
  const projectData = {
    title:           req.body.title,
    description:     req.body.description,
    longDescription: req.body.longDescription || '',
    category:        req.body.category || 'fullstack',
    status:          req.body.status || 'completed',
    liveUrl:         req.body.liveUrl || '',
    githubUrl:       req.body.githubUrl || '',
    featured:        req.body.featured === 'true' || req.body.featured === true,
    order:           Number(req.body.order) || 0,
    techStack:       parseTechStack(req.body.techStack),
  };

  // Convert image to Base64 and store in MongoDB
  if (req.file) {
    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'projects',
        req.file.mimetype
      );
      projectData.thumbnail = {
        url:      result.secure_url, // Base64 data URL
        publicId: result.public_id,
      };
    } catch (err) {
      console.error('Image processing error:', err.message);
    }
  }

  const project = await Project.create(projectData);
  sendSuccess(res, 201, 'Project created successfully', { project });
});

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────
exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError('Project not found', 404));

  const updateData = {
    title:           req.body.title           || project.title,
    description:     req.body.description     || project.description,
    longDescription: req.body.longDescription || project.longDescription,
    category:        req.body.category        || project.category,
    status:          req.body.status          || project.status,
    liveUrl:         req.body.liveUrl         !== undefined ? req.body.liveUrl   : project.liveUrl,
    githubUrl:       req.body.githubUrl       !== undefined ? req.body.githubUrl : project.githubUrl,
    featured:        req.body.featured === 'true' || req.body.featured === true,
    order:           Number(req.body.order)   || project.order,
    techStack:       parseTechStack(req.body.techStack) || project.techStack,
  };

  // Replace image with new Base64
  if (req.file) {
    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        'projects',
        req.file.mimetype
      );
      updateData.thumbnail = {
        url:      result.secure_url,
        publicId: result.public_id,
      };
    } catch (err) {
      console.error('Image processing error:', err.message);
    }
  }

  const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
  sendSuccess(res, 200, 'Project updated successfully', { project: updated });
});

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError('Project not found', 404));
  // Image is stored in the document — deleting document deletes image too
  await project.deleteOne();
  sendSuccess(res, 200, 'Project deleted successfully');
});