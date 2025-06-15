// backend/routes/contactRoutes.js
import express from 'express';
const router = express.Router();
import { submitContactForm, deleteMessage } from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// This route allows anyone to POST a new message
router.route('/').post(submitContactForm);

// This new route allows an admin to DELETE a message by its ID
router.route('/:id').delete(protect, admin, deleteMessage);

export default router;