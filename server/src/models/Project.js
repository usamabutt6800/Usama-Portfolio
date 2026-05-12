/**
 * models/Project.js - Portfolio project model
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    longDescription: {
      type: String,
      default: '',
    },
    // Main thumbnail image
    thumbnail: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }, // Cloudinary public_id for deletion
    },
    // Multiple images gallery
    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    // Technologies used
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    // Project category for filtering
    category: {
      type: String,
      enum: ['fullstack', 'frontend', 'backend', 'mobile', 'ai', 'other'],
      default: 'fullstack',
    },
    // External links
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    // Control visibility on portfolio
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['completed', 'in-progress', 'planned'],
      default: 'completed',
    },
    // Display order
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
projectSchema.index({ category: 1, featured: -1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);
