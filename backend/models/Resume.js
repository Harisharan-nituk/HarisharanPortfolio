// backend/models/Resume.js
import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    field: { // e.g., 'Machine Learning', 'Web Development', 'Python Developer'
      type: String,
      required: [true, 'Please specify the field/category for the resume'],
    },
    originalFilename: { // The name of the file as uploaded by the user
      type: String,
      required: [true, 'Original filename is required'],
    },
    storedFilename: { // The unique filename stored on the server (to avoid conflicts)
      type: String,
      required: [true, 'Stored filename is required'],
    },
    filePath: { // The path on the server where the file is stored
      type: String,
      required: [true, 'File path is required'],
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
    // uploadDate is handled by timestamps: true
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;