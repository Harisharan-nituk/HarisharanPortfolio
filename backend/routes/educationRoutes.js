import express from 'express';
import {
  addEducation,
  getEducationHistory,
  getEducationById,
  updateEducation,
  deleteEducation
} from '../controllers/educationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Combined route for the root endpoint '/'
router.route('/')
  .get(getEducationHistory) // PUBLIC: Anyone can view education history
  .post(protect, admin, addEducation); // ADMIN: Only admins can add a new entry

// Routes for a specific entry by its ID
router.route('/:id')
  .get(getEducationById) // Fetches a single entry
  .put(protect, admin, updateEducation)    // Updates an entry
  .delete(protect, admin, deleteEducation); // Deletes an entry

export default router;