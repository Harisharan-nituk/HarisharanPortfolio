// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer'; // Keep multer import for the error handler
import path from 'path';
import { fileURLToPath } from 'url';

// Config and Route Imports
import connectDB from './config/db.js';
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
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// --- Production Build Static-Serving Logic ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}
// --- End of Production Logic ---

// --- API Routers ---
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
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running for development...');
  });
}

// --- Custom Error Handling Middleware (including Multer) ---

// Multer-specific error handling middleware is PRESERVED here
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("MulterError Caught:", err.code, err.message);
    let message = 'File upload failed.';
    let statusCode = 400;

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File is too large.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = err.field ? `Unexpected file field: ${err.field}.` : 'Invalid file type or field name.';
    }
    // ... you can add other multer error codes here if needed
    
    return res.status(statusCode).json({
      message: message,
      type: 'MulterError',
      code: err.code
    });
  }
  // Pass other errors to the general error handler
  next(err);
});

// General error handlers
app.use(notFound); // Handles 404s
app.use(errorHandler); // Handles other server errors

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));