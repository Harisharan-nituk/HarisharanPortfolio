// backend/models/Experience.js
import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      // Optional - if not provided, it means current position
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    companyLogo: {
      type: String, // Public URL from Supabase
    },
    storedLogoFilename: {
      type: String, // Path in Supabase bucket for deletion
    },
  },
  {
    timestamps: true,
  }
);

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;

