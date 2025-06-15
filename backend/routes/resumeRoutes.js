// backend/routes/resumeRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import {
  addResume, getResumesList, deleteResume, updateResume, uploadResumeMiddleware
} from '../controllers/resumeController.js';
import Resume from '../models/Resume.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getResumesList).post(protect, admin, uploadResumeMiddleware, addResume);
router.route('/:id')
  .get(asyncHandler(async (req, res) => {
    const resume = await Resume.findById(req.params.id);
    if (resume) {
      res.json(resume);
    } else {
      res.status(404);
      throw new Error('Resume not found');
    }
  }))
  .put(protect, admin, uploadResumeMiddleware, updateResume)
  .delete(protect, admin, deleteResume);

export default router;