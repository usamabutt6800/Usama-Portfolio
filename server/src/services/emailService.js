/**
 * emailService.js - All email sending functions
 */

const nodemailer = require('nodemailer');

// ─── Create transporter ───────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
};

// ─── Check if email is configured ────────────────────────────────────────────
const isEmailConfigured = () =>
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_USER !== 'your.email@gmail.com';

// ─── 1. Notify admin when someone sends a contact message ────────────────────
const sendAdminNotification = async ({ name, email, subject, message }) => {
  if (!isEmailConfigured()) {
    console.log('📧 Email not configured — skipping admin notification');
    return;
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to yourself (admin)
    subject: `📬 New Message from ${name}: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #a855f7); padding: 24px;">
          <h2 style="margin: 0; color: white; font-size: 20px;">📬 New Portfolio Message</h2>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px; width: 80px;">From:</td>
              <td style="padding: 8px 0; color: #fff; font-size: 13px;"><strong>${name}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px;">Email:</td>
              <td style="padding: 8px 0; font-size: 13px;"><a href="mailto:${email}" style="color: #6c63ff;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888; font-size: 13px;">Subject:</td>
              <td style="padding: 8px 0; color: #fff; font-size: 13px;">${subject}</td>
            </tr>
          </table>
          <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #6c63ff; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
            <p style="margin: 0; color: #ccc; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <a href="mailto:${email}?subject=Re: ${subject}" 
            style="display: inline-block; background: linear-gradient(135deg, #6c63ff, #a855f7); color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 600;">
            Reply to ${name}
          </a>
          <p style="margin-top: 20px; color: #555; font-size: 12px;">
            You can also reply from your 
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/messages" style="color: #6c63ff;">Admin Dashboard</a>
          </p>
        </div>
      </div>
    `,
  });
};

// ─── 2. Auto-reply to sender ──────────────────────────────────────────────────
const sendAutoReply = async ({ name, email, subject, message }) => {
  if (!isEmailConfigured()) return;

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: `✅ Got your message — I'll reply soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #a855f7); padding: 24px;">
          <h2 style="margin: 0; color: white;">Thanks for reaching out, ${name}! 👋</h2>
        </div>
        <div style="padding: 24px;">
          <p style="color: #ccc; line-height: 1.6;">I've received your message and will get back to you within <strong style="color: #6c63ff;">24-48 hours</strong>.</p>
          <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #6c63ff; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0;">
            <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your message:</p>
            <p style="margin: 0; color: #ccc; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #555; font-size: 13px;">Best regards,<br><strong style="color: #fff;">Usama Butt</strong><br><span style="color: #6c63ff;">MERN Stack Developer</span></p>
        </div>
      </div>
    `,
  });
};

// ─── 3. Admin reply to a specific message ────────────────────────────────────
const sendReplyEmail = async ({ toName, toEmail, originalSubject, replyText }) => {
  if (!isEmailConfigured()) {
    throw new Error('Email not configured. Add EMAIL_USER and EMAIL_PASS to your .env file.');
  }

  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: `Re: ${originalSubject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #ffffff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6c63ff, #a855f7); padding: 24px;">
          <h2 style="margin: 0; color: white; font-size: 18px;">Re: ${originalSubject}</h2>
        </div>
        <div style="padding: 24px;">
          <p style="color: #aaa; font-size: 14px; margin-bottom: 16px;">Hi ${toName},</p>
          <div style="color: #e2e8f0; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">
            ${replyText.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #555; font-size: 13px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-top: 16px;">
            Best regards,<br>
            <strong style="color: #fff;">Usama Butt</strong><br>
            <span style="color: #6c63ff;">MERN Stack Developer</span><br>
            <a href="mailto:${process.env.EMAIL_USER}" style="color: #6c63ff; font-size: 12px;">${process.env.EMAIL_USER}</a>
          </p>
        </div>
      </div>
    `,
  });
};

// ─── Combined: send contact form (notification + auto-reply) ─────────────────
const sendContactEmail = async ({ name, email, subject, message }) => {
  // Run both in parallel, don't fail if one fails
  const results = await Promise.allSettled([
    sendAdminNotification({ name, email, subject, message }),
    sendAutoReply({ name, email, subject, message }),
  ]);

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Email ${i === 0 ? 'admin notification' : 'auto-reply'} failed:`, result.reason?.message);
    }
  });
};

module.exports = { sendContactEmail, sendReplyEmail };