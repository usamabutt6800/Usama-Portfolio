/**
 * models/Skill.js - Developer skills model
 */

const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    // Proficiency level 0-100
    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    // Category for grouping
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'languages', 'other'],
      default: 'other',
    },
    // Icon name from react-icons or a URL
    icon: {
      type: String,
      default: '',
    },
    // Background color for the skill card
    color: {
      type: String,
      default: '#00f5ff',
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

module.exports = mongoose.model('Skill', skillSchema);
