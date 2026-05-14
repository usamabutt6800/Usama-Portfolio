/**
 * controllers/profileController.js
 * Images stored as Base64 in MongoDB
 */

const Profile = require('../models/Profile');
const { catchAsync, sendSuccess } = require('../utils/errorHandler');
const { bufferToBase64 } = require('../middleware/uploadMiddleware');

// ─── Parse nested FormData like social[github] → { social: { github } } ──────
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

  // Handle resumeUrl
  if (updateData.resumeUrl !== undefined) {
    updateData.resume = { url: updateData.resumeUrl, publicId: '' };
    delete updateData.resumeUrl;
  }

  // Convert avatar to Base64 and store in MongoDB
  if (req.file) {
    try {
      const base64Url = bufferToBase64(req.file.buffer, req.file.mimetype);
      updateData.avatar = {
        url:      base64Url,
        publicId: `base64_avatar_${Date.now()}`,
      };
    } catch (err) {
      console.error('Image processing error:', err.message);
    }
  }

  const updated = await Profile.findByIdAndUpdate(
    profile._id,
    { $set: updateData },
    { new: true, runValidators: false }
  );

  sendSuccess(res, 200, 'Profile updated successfully', { profile: updated });
});