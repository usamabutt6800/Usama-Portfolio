/**
 * uploadMiddleware.js
 * Stores images as Base64 strings directly in MongoDB
 * No Cloudinary, no local folder needed
 */

const multer = require('multer');
const path   = require('path');

// Store file in memory as buffer
const storage = multer.memoryStorage();

// Only allow images
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext     = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime    = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error('Only image files (jpg, png, webp, gif) are allowed'));
};

// Max 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * Convert buffer to Base64 data URL
 * Stored directly in MongoDB as a string
 * Format: "data:image/jpeg;base64,/9j/4AAQSkZ..."
 */
const bufferToBase64 = (buffer, mimetype) => {
  const base64 = buffer.toString('base64');
  return `data:${mimetype};base64,${base64}`;
};

/**
 * uploadToCloudinary — renamed to uploadImage
 * Now stores as Base64 in MongoDB instead of Cloudinary
 * Returns same shape { url, publicId } so all controllers work unchanged
 */
const uploadToCloudinary = async (buffer, folder, mimetype = 'image/jpeg') => {
  const base64Url = bufferToBase64(buffer, mimetype);
  return {
    secure_url: base64Url,  // The full base64 data URL
    public_id:  `base64_${folder}_${Date.now()}`, // Fake publicId for compatibility
  };
};

/**
 * deleteFromCloudinary — no-op since images are in MongoDB
 * When you delete a document, the base64 string is deleted with it
 */
const deleteFromCloudinary = async (publicId) => {
  // Nothing to do — image is stored in the document itself
  // When the document is deleted, the image goes with it
  console.log(`🗑️  Image ${publicId} will be removed with the document`);
};

module.exports = { upload, uploadToCloudinary, deleteFromCloudinary, bufferToBase64 };