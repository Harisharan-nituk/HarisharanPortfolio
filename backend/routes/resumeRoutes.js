// backend/routes/resumeRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  addResume,
  getResumesList,
  deleteResume,
  updateResume,
  uploadResumeMiddleware
} from '../controllers/resumeController.js';
import Resume from '../models/Resume.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Routes for the main /api/resumes endpoint ---
router.route('/')
  .get(getResumesList) // PUBLIC: Anyone can get the list of resumes
  .post(protect, admin, uploadResumeMiddleware, addResume); // ADMIN: Only admins can add a new resume

// --- Routes for a specific resume by its ID ---
router.route('/:id')
  .get(asyncHandler(async (req, res) => { // PUBLIC: Anyone can get a single resume by ID
    const resume = await Resume.findById(req.params.id);
    if (resume) {
      res.json(resume);
    } else {
      res.status(404);
      throw new Error('Resume not found');
    }
  }))
  .put(protect, admin, uploadResumeMiddleware, updateResume) // ADMIN: Update a specific resume
  .delete(protect, admin, deleteResume); // ADMIN: Delete a specific resume

export default router;