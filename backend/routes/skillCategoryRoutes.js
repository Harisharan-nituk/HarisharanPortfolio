// backend/routes/skillCategoryRoutes.js
import express from 'express';
import {
  addSkillCategory, getSkillCategories, getSkillCategoryById,
  updateSkillCategory, deleteSkillCategory, addSkillToCategory, deleteSkillFromCategory
} from '../controllers/skillCategoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getSkillCategories).post(protect, admin, addSkillCategory);
router.route('/:id').get(getSkillCategoryById).put(protect, admin, updateSkillCategory).delete(protect, admin, deleteSkillCategory);
router.route('/:categoryId/skills').post(protect, admin, addSkillToCategory);
router.route('/:categoryId/skills/:skillName').delete(protect, admin, deleteSkillFromCategory);

export default router;