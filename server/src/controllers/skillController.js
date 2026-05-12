/**
 * controllers/skillController.js
 */
const Skill = require('../models/Skill');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');

exports.getAllSkills = catchAsync(async (req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 });
  sendSuccess(res, 200, 'Skills retrieved', { skills });
});

exports.createSkill = catchAsync(async (req, res) => {
  const skill = await Skill.create(req.body);
  sendSuccess(res, 201, 'Skill created', { skill });
});

exports.updateSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!skill) return next(new AppError('Skill not found', 404));
  sendSuccess(res, 200, 'Skill updated', { skill });
});

exports.deleteSkill = catchAsync(async (req, res, next) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) return next(new AppError('Skill not found', 404));
  sendSuccess(res, 200, 'Skill deleted');
});
