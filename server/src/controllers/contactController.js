/**
 * contactController.js
 */
const Contact = require('../models/Contact');
const { sendContactEmail, sendReplyEmail } = require('../services/emailService');
const { catchAsync, AppError, sendSuccess } = require('../utils/errorHandler');

// ─── POST /api/contact — Submit form ─────────────────────────────────────────
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new AppError('All fields are required', 400));
  }

  // Save to database first
  const contact = await Contact.create({ name, email, subject, message });

  // Send emails (admin notification + auto-reply to sender)
  try {
    await sendContactEmail({ name, email, subject, message });
    console.log(`📧 Emails sent for message from ${name} <${email}>`);
  } catch (emailError) {
    console.error('Email sending failed:', emailError.message);
    // Don't fail the request — message is saved in DB
  }

  sendSuccess(res, 201, "Message sent successfully! I'll get back to you soon.", {
    contact: { id: contact._id, name, email, subject },
  });
});

// ─── GET /api/contact — Get all messages (admin) ──────────────────────────────
exports.getMessages = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;

  const messages = await Contact.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Contact.countDocuments();
  const unread = await Contact.countDocuments({ isRead: false });

  sendSuccess(res, 200, 'Messages retrieved', {
    messages,
    pagination: { total, unread, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

// ─── PATCH /api/contact/:id/read — Mark as read ───────────────────────────────
exports.markAsRead = catchAsync(async (req, res, next) => {
  const message = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!message) return next(new AppError('Message not found', 404));
  sendSuccess(res, 200, 'Marked as read', { message });
});

// ─── POST /api/contact/:id/reply — Admin replies to a message ─────────────────
exports.replyToMessage = catchAsync(async (req, res, next) => {
  const { replyText } = req.body;

  if (!replyText || replyText.trim() === '') {
    return next(new AppError('Reply text is required', 400));
  }

  const message = await Contact.findById(req.params.id);
  if (!message) return next(new AppError('Message not found', 404));

  // Send reply email to original sender
  await sendReplyEmail({
    toName:          message.name,
    toEmail:         message.email,
    originalSubject: message.subject,
    replyText:       replyText.trim(),
  });

  // Save reply in database
  const updated = await Contact.findByIdAndUpdate(
    req.params.id,
    {
      reply:     replyText.trim(),
      repliedAt: new Date(),
      isRead:    true,
    },
    { new: true }
  );

  sendSuccess(res, 200, `Reply sent to ${message.name} at ${message.email}`, {
    message: updated,
  });
});

// ─── DELETE /api/contact/:id — Delete message ─────────────────────────────────
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const message = await Contact.findByIdAndDelete(req.params.id);
  if (!message) return next(new AppError('Message not found', 404));
  sendSuccess(res, 200, 'Message deleted');
});