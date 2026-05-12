/**
 * controllers/profileController.js
 * Fixed: properly handles nested FormData fields + local image storage as fallback
 */

const Profile = require('../models/Profile');
const { catchAsync, sendSuccess } = require('../utils/errorHandler');
const path = require('path');
const fs = require('fs');

// ─── Helper: Try Cloudinary, fall back to local storage ──────────────────────
const handleImageUpload = async (file, profile) => {
  const cloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key';

  if (cloudinaryConfigured) {
    const { uploadToCloudinary, deleteFromCloudinary } = require('../middleware/uploadMiddleware');
    if (profile.avatar?.publicId) {
      await deleteFromCloudinary(profile.avatar.publicId).catch(() => {});
    }
    const result = await uploadToCloudinary(file.buffer, 'portfolio/profile');
    return { url: result.secure_url, publicId: result.public_id };
  } else {
    // Fallback: save to local uploads folder
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    // Delete old local file if it exists
    if (profile.avatar?.publicId && profile.avatar.publicId.startsWith('local_')) {
      const oldFile = path.join(uploadsDir, profile.avatar.publicId.replace('local_', ''));
      if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    }

    const ext = file.originalname.split('.').pop();
    const filename = `avatar_${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), file.buffer);

    const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
    return {
      url: `${serverUrl}/uploads/${filename}`,
      publicId: `local_${filename}`,
    };
  }
};

// ─── Helper: Parse nested FormData like social[github] → { social: { github } }
const parseNestedFormData = (body) => {
  const result = {};
  for (const [key, value] of Object.entries(body)) {
    const match = key.match(/^(\w+)\[(\w+)\]$/);
    if (match) {
      const [, parent, child] = match;
      if (!result[parent]) result[parent] = {};
      result[parent][child] = isNaN(value) || value === '' ? value : Number(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};

// ─── GET /api/profile ─────────────────────────────────────────────────────────
exports.getProfile = catchAsync(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  sendSuccess(res, 200, 'Profile retrieved', { profile });
});

// ─── PUT /api/profile ─────────────────────────────────────────────────────────
exports.updateProfile = catchAsync(async (req, res) => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});

  const updateData = parseNestedFormData(req.body);

  // Handle resumeUrl field → store as resume.url in DB
  if (updateData.resumeUrl !== undefined) {
    updateData.resume = { url: updateData.resumeUrl, publicId: '' };
    delete updateData.resumeUrl;
  }

  if (req.file) {
    try {
      updateData.avatar = await handleImageUpload(req.file, profile);
    } catch (imgError) {
      console.error('Image upload error:', imgError.message);
      // Continue saving other fields even if image fails
    }
  }

  const updated = await Profile.findByIdAndUpdate(
    profile._id,
    { $set: updateData },
    { new: true, runValidators: false }
  );

  sendSuccess(res, 200, 'Profile updated successfully', { profile: updated });
});