import express from 'express';
import {
  addSocialLink,
  getSocialLinks,
  getAdminSocialLinks,
  getSocialLinkById,
  updateSocialLink,
  deleteSocialLink,
} from '../controllers/socialLinkController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ADMIN: Get all links (must be defined before '/:id')
router.get('/admin', protect, admin, getAdminSocialLinks);

// PUBLIC: Get enabled links
router.get('/', getSocialLinks);

// ADMIN: Create a new link
router.post('/', protect, admin, addSocialLink);

// ADMIN: Routes for a specific link by its ID
router
  .route('/:id')
  .get(protect, admin, getSocialLinkById)
  .put(protect, admin, updateSocialLink)
  .delete(protect, admin, deleteSocialLink);

export default router;