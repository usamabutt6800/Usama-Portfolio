/**
 * middleware/uploadMiddleware.js
 * Handles file uploads using Multer + Cloudinary
 */

const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// ─── Multer: Store in memory (then upload to Cloudinary) ─────────────────────
const storage = multer.memoryStorage();

// ─── File Filter: Only allow images ──────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpg, png, webp, gif) are allowed!'));
};

// ─── Multer config ────────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },
});

// ─── Upload to Cloudinary ─────────────────────────────────────────────────────
const uploadToCloudinary = (buffer, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        quality: 'auto', // Auto optimize quality
        fetch_format: 'auto', // Auto convert to best format (webp)
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

// ─── Delete from Cloudinary ───────────────────────────────────────────────────
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary };
