/**
 * models/Experience.js - Work experience model
 */

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    // Key achievements/responsibilities
    responsibilities: [
      {
        type: String,
      },
    ],
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null, // null means current job
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      default: '',
    },
    companyLogo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    techUsed: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'freelance', 'internship', 'contract'],
      default: 'full-time',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Experience', experienceSchema);
