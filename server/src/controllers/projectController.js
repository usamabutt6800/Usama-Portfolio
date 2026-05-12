/**
 * controllers/projectController.js
 * Fixed: techStack parsing + local image fallback (no Cloudinary needed)
 */

const Project = require('../models/Project');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');
const path = require('path');
const fs = require('fs');

// ─── Check if Cloudinary is properly configured ───────────────────────────────
const isCloudinaryConfigured = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key';

// ─── Save image locally to server/src/uploads/ ───────────────────────────────
const saveLocalImage = (buffer, originalname) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const ext = originalname.split('.').pop();
  const filename = `project_${Date.now()}.${ext}`;
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);

  const serverUrl = `http://localhost:${process.env.PORT || 5000}`;
  return {
    url: `${serverUrl}/uploads/${filename}`,
    publicId: `local_${filename}`,
  };
};

// ─── Delete local image ───────────────────────────────────────────────────────
const deleteLocalImage = (publicId) => {
  try {
    if (publicId && publicId.startsWith('local_')) {
      const filename = publicId.replace('local_', '');
      const filepath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
  } catch (e) { /* silent */ }
};

// ─── Handle image upload (Cloudinary or local) ────────────────────────────────
const handleImageUpload = async (file) => {
  if (isCloudinaryConfigured()) {
    const { uploadToCloudinary } = require('../middleware/uploadMiddleware');
    const result = await uploadToCloudinary(file.buffer, 'portfolio/projects');
    return { url: result.secure_url, publicId: result.public_id };
  }
  return saveLocalImage(file.buffer, file.originalname);
};

// ─── Parse techStack — handles both JSON array string and comma-separated ─────
const parseTechStack = (techStack) => {
  if (!techStack) return [];
  if (Array.isArray(techStack)) return techStack;
  // Try JSON parse first (e.g. '["React","Node.js"]')
  try {
    const parsed = JSON.parse(techStack);
    if (Array.isArray(parsed)) return parsed.map(t => t.trim()).filter(Boolean);
  } catch {
    // Fall back to comma-separated (e.g. "React, Node.js, MongoDB")
  }
  return techStack.split(',').map(t => t.trim()).filter(Boolean);
};

// ─── GET /api/projects ────────────────────────────────────────────────────────
exports.getAllProjects = catchAsync(async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (featured === 'true') filter.featured = true;

  const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });
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

  // Handle thumbnail upload
  if (req.file) {
    try {
      projectData.thumbnail = await handleImageUpload(req.file);
    } catch (err) {
      console.error('Image upload error:', err.message);
      // Continue without image — don't fail the whole request
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
    liveUrl:         req.body.liveUrl         !== undefined ? req.body.liveUrl : project.liveUrl,
    githubUrl:       req.body.githubUrl       !== undefined ? req.body.githubUrl : project.githubUrl,
    featured:        req.body.featured === 'true' || req.body.featured === true,
    order:           Number(req.body.order)   || project.order,
    techStack:       parseTechStack(req.body.techStack) || project.techStack,
  };

  // Handle new thumbnail
  if (req.file) {
    try {
      // Delete old image
      if (project.thumbnail?.publicId) {
        if (isCloudinaryConfigured()) {
          const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');
          await deleteFromCloudinary(project.thumbnail.publicId).catch(() => {});
        } else {
          deleteLocalImage(project.thumbnail.publicId);
        }
      }
      updateData.thumbnail = await handleImageUpload(req.file);
    } catch (err) {
      console.error('Image upload error:', err.message);
    }
  }

  const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
  sendSuccess(res, 200, 'Project updated successfully', { project: updated });
});

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new AppError('Project not found', 404));

  // Delete image
  if (project.thumbnail?.publicId) {
    if (isCloudinaryConfigured()) {
      const { deleteFromCloudinary } = require('../middleware/uploadMiddleware');
      await deleteFromCloudinary(project.thumbnail.publicId).catch(() => {});
    } else {
      deleteLocalImage(project.thumbnail.publicId);
    }
  }

  await project.deleteOne();
  sendSuccess(res, 200, 'Project deleted successfully');
});