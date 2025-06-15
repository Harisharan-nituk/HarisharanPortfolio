// backend/routes/projectRoutes.js
import express from 'express';
import {
  addProject, getProjects, getProjectById, updateProject, deleteProject, uploadProjectImageMiddleware
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProjects).post(protect, admin, uploadProjectImageMiddleware, addProject);
router.route('/:id').get(getProjectById).put(protect, admin, uploadProjectImageMiddleware, updateProject).delete(protect, admin, deleteProject);

export default router;