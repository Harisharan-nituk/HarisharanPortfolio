// backend/routes/contactRoutes.js
import express from 'express';
const router = express.Router();
import { submitContactForm, deleteMessage } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(submitContactForm);
router.route('/:id').delete(protect, admin, deleteMessage);

export default router;