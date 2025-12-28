// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';

// Import all of your route files
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import educationRoutes from './routes/educationRoutes.js';
import skillCategoryRoutes from './routes/skillCategoryRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import socialLinkRoutes from './routes/socialLinkRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';

// Import your custom error handling middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Initial setup
dotenv.config();
connectDB();
const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());

// --- Logic for Production Hosting ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app's 'build' folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}
// --- End of Production Logic ---


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/skillcategories', skillCategoryRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/sociallinks', socialLinkRoutes);
app.use('/api/admin', dashboardRoutes);
app.use('/api/achievements', achievementRoutes);


// --- Production Catch-all Route ---
// This serves your React app's main HTML file for any route not handled by the API
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
} else {
  // A simple root route for testing the API in development
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}
// --- End of Catch-all ---


// --- Custom Error Handling Middleware ---

// This handles errors specifically from Multer (file uploads)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("MulterError Caught:", err.code, err.message);
    let message = 'File upload failed.';
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File is too large.';
    if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Invalid file type or field name.';
    return res.status(400).json({ message, type: 'MulterError', code: err.code });
  }
  next(err);
});

// These handle general 404s and other server errors
app.use(notFound);
app.use(errorHandler);
// --- End of Error Handling ---


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));