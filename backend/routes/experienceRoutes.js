// backend/routes/experienceRoutes.js
import express from 'express';
import {
  addExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
  uploadExperienceLogoMiddleware
} from '../controllers/experienceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all experiences
router.route('/').get(getExperiences);

// Admin route to add a new experience
router.route('/').post(protect, admin, uploadExperienceLogoMiddleware, addExperience);

// Routes for a single experience
router.route('/:id')
  .get(getExperienceById) // Public route to get a single experience
  .put(protect, admin, uploadExperienceLogoMiddleware, updateExperience) // Admin route to update
  .delete(protect, admin, deleteExperience); // Admin route to delete

export default router;

