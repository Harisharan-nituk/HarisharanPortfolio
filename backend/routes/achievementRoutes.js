// backend/routes/achievementRoutes.js
import express from 'express';
import {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAchievements)
  .post(protect, admin, addAchievement);

router.route('/:id')
  .put(protect, admin, updateAchievement)
  .delete(protect, admin, deleteAchievement);

export default router;