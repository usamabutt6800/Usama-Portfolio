/**
 * controllers/testimonialController.js
 */
const Testimonial = require('../models/Testimonial');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');

exports.getAllTestimonials = catchAsync(async (req, res) => {
  const filter = req.user ? {} : { isVisible: true };
  const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
  sendSuccess(res, 200, 'Testimonials retrieved', { testimonials });
});

exports.createTestimonial = catchAsync(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  sendSuccess(res, 201, 'Testimonial created', { testimonial });
});

exports.updateTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!testimonial) return next(new AppError('Testimonial not found', 404));
  sendSuccess(res, 200, 'Testimonial updated', { testimonial });
});

exports.deleteTestimonial = catchAsync(async (req, res, next) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return next(new AppError('Testimonial not found', 404));
  sendSuccess(res, 200, 'Testimonial deleted');
});
