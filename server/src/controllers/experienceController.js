/**
 * controllers/experienceController.js
 */
const Experience = require('../models/Experience');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');

exports.getAllExperiences = catchAsync(async (req, res) => {
  const experiences = await Experience.find().sort({ isCurrent: -1, startDate: -1 });
  sendSuccess(res, 200, 'Experiences retrieved', { experiences });
});

exports.createExperience = catchAsync(async (req, res) => {
  const experience = await Experience.create(req.body);
  sendSuccess(res, 201, 'Experience created', { experience });
});

exports.updateExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!experience) return next(new AppError('Experience not found', 404));
  sendSuccess(res, 200, 'Experience updated', { experience });
});

exports.deleteExperience = catchAsync(async (req, res, next) => {
  const experience = await Experience.findByIdAndDelete(req.params.id);
  if (!experience) return next(new AppError('Experience not found', 404));
  sendSuccess(res, 200, 'Experience deleted');
});
