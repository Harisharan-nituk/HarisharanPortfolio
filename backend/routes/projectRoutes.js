// backend/routes/projectRoutes.js
import express from 'express';
import {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  uploadProjectImageMiddleware
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all projects
router.route('/').get(getProjects);

// Admin route to add a new project
router.route('/').post(protect, admin, uploadProjectImageMiddleware, addProject);

// Routes for a single project
router.route('/:id')
  .get(getProjectById) // Public route to get a single project
  .put(protect, admin, uploadProjectImageMiddleware, updateProject) // Admin route to update
  .delete(protect, admin, deleteProject); // Admin route to delete

export default router;