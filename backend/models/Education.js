// backend/models/Education.js
import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: String, // Or Date, depending on how you want to handle it
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String, // Or Date. 'Present' can also be a value.
      required: [true, 'End date is required'],
    },
    gpa: {
      type: String, // e.g., "3.8/4.0" or "8.5/10"
      trim: true,
    },
    description: { // Key courses, thesis, achievements during this education
      type: String,
      trim: true,
    },
    // You might want to link education to a user if you have multiple admins in future,
    // but for a personal portfolio, it's usually just your education.
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   // required: true, // if it must be tied to an admin
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Optional: Add an index if you frequently query by institution or degree
// educationSchema.index({ institution: 1 });

const Education = mongoose.model('Education', educationSchema);

export default Education;