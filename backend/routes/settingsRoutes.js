// backend/routes/settingsRoutes.js
import express from 'express';
import {
  getSettings,
  updateSettings,
  uploadOrUpdateProfilePhoto,
  uploadProfilePhotoMiddleware // NEW: Import Multer middleware for use in routes
} from '../controllers/settingsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, admin, updateSettings);

router.post('/profile-photo', protect, admin, uploadProfilePhotoMiddleware, uploadOrUpdateProfilePhoto); // NEW: Multer middleware directly in route

export default router;