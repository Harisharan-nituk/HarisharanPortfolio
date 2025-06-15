
// backend/routes/dashboardRoutes.js
import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// This single endpoint will gather all data needed for the dashboard
router.get('/summary', protect, admin, getDashboardSummary);

export default router;