/**
 * models/Profile.js - Portfolio owner's profile data
 * Only one document (singleton pattern)
 */

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Your Name' },
    title: { type: String, default: 'MERN Stack Developer' },
    // Multiple roles for typewriter animation
    roles: [{ type: String }],
    bio: { type: String, default: '' },
    shortBio: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    resume: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    // Social links
    social: {
      github:    { type: String, default: '' },
      linkedin:  { type: String, default: '' },
      twitter:   { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube:   { type: String, default: '' },
      website:   { type: String, default: '' },
    },
    // Stats for hero section
    stats: {
      yearsExperience: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      clientsSatisfied: { type: Number, default: 0 },
    },
    // SEO
    seo: {
      metaTitle:       { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords:        [{ type: String }],
      ogImage:         { type: String, default: '' },
    },
    // Site settings
    settings: {
      availableForWork: { type: Boolean, default: true },
      showBlog:         { type: Boolean, default: true },
      primaryColor:     { type: String, default: '#00f5ff' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
