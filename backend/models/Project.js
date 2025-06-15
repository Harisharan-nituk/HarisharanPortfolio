// backend/models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    imageUrl: { 
      type: String, // Public URL from Supabase
    },
    storedImageFilename: { // Path in Supabase bucket for deletion
      type: String,
    },
    projectLink: { // Live demo link
      type: String,
      trim: true,
    },
    githubUrl: { // GitHub repo link
      type: String,
      trim: true,
    },
    technologies: { 
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, 
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;