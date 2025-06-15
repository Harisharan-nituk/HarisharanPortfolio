// backend/routes/educationRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler'; // If you use it in controllers for error handling
import {
  addEducation,
  getEducationHistory,
  getEducationById,
  updateEducation,
  deleteEducation
} from '../controllers/educationController.js'; // Ensure this path is correct
import { protect, admin } from '../middleware/authMiddleware.js'; // For securing admin routes

const router = express.Router();

// --- Public Route ---
// Anyone can view education history
router.route('/')
  .get(getEducationHistory); // GET /api/education - Fetches all education entries

// --- Admin Routes (Secured) ---
// Only admin can add new education entries
router.route('/')
  .post(protect, admin, addEducation); // POST /api/education - Adds a new education entry

router.route('/:id')
  .get(getEducationById) // GET /api/education/:id - Fetches a single entry (can be public or admin only for editing)
  .put(protect, admin, updateEducation)    // PUT /api/education/:id - Updates an education entry
  .delete(protect, admin, deleteEducation); // DELETE /api/education/:id - Deletes an education entry

export default router;