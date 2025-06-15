// backend/routes/certificateRoutes.js
import express from 'express';
import {
  addCertificate,
  getCertificates,
  deleteCertificate,
  updateCertificate,
  uploadCertificateImageMiddleware // NEW: Import Multer middleware for use in routes
} from '../controllers/certificateController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCertificates)
  .post(protect, admin, uploadCertificateImageMiddleware, addCertificate); // NEW: Multer middleware directly in route

router.route('/:id')
  .put(protect, admin, uploadCertificateImageMiddleware, updateCertificate) // NEW: Multer middleware directly in route
  .delete(protect, admin, deleteCertificate);

export default router;