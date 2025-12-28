// Harisharan_portfolio/backend/controllers/resumeController.js
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Resume from '../models/Resume.js';
import { supabase } from '../config/supabaseConfig.js';

// --- No changes needed here, this part is correct ---
const resumeStorage = multer.memoryStorage();
const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not a PDF file! Please upload only PDFs.'), false);
  }
};
export const uploadResumeMiddleware = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('resumeFile');

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;
// --- End of unchanged section ---

const addResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No resume file was uploaded.');
  }
  const { field } = req.body;
  if (!field) {
    res.status(400);
    throw new Error('The "field" for the resume is required.');
  }

  const uniqueFilename = `${uuidv4()}-${req.file.originalname}`;
  const filePathInBucket = `resumes/${uniqueFilename}`;

  // Upload to Supabase
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePathInBucket, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false, // Do not overwrite existing files with the same name
    });

  if (uploadError) {
    console.error('Supabase Upload Error:', uploadError);
    res.status(500);
    throw new Error(`Failed to upload resume to cloud storage: ${uploadError.message}`);
  }

  // Get public URL for the newly uploaded file
  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePathInBucket);

  // Save metadata to MongoDB
  const newResume = new Resume({
    field: field.trim(),
    originalFilename: req.file.originalname,
    storedFilename: filePathInBucket,
    filePath: urlData.publicUrl,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  const createdResume = await newResume.save();
  res.status(201).json(createdResume);
});

const getResumesList = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({}).sort({ createdAt: -1 });
  res.json(resumes);
});

const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (resume) {
    // If a stored filename exists, attempt to delete from Supabase
    if (resume.storedFilename) {
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([resume.storedFilename]);
      if (deleteError) {
        // Log the error but proceed to delete from DB anyway
        console.error(`Could not delete file from Supabase: ${deleteError.message}`);
      }
    }
    await Resume.deleteOne({ _id: resume._id });
    res.json({ message: 'Resume removed successfully.' });
  } else {
    res.status(404);
    throw new Error('Resume not found');
  }
});

const updateResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  // Update text field
  resume.field = req.body.field || resume.field;

  // If a new file is being uploaded
  if (req.file) {
    const oldStoredFilename = resume.storedFilename;

    // Upload new file first
    const newUniqueFilename = `${uuidv4()}-${req.file.originalname}`;
    const newFilePathInBucket = `resumes/${newUniqueFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newFilePathInBucket, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) {
      console.error('Supabase Update-Upload Error:', uploadError);
      res.status(500);
      throw new Error(`Failed to upload new resume file: ${uploadError.message}`);
    }

    // If new upload is successful, get its public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newFilePathInBucket);

    // Update the document with new file details
    resume.originalFilename = req.file.originalname;
    resume.storedFilename = newFilePathInBucket;
    resume.filePath = urlData.publicUrl;
    resume.mimetype = req.file.mimetype;
    resume.size = req.file.size;

    // Now, safely delete the old file from Supabase
    if (oldStoredFilename) {
        const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldStoredFilename]);
        if (deleteError) {
            console.error(`Failed to delete old Supabase file '${oldStoredFilename}': ${deleteError.message}`);
            // Non-fatal, as the main goal was to upload the new file
        }
    }
  }

  const updatedResume = await resume.save();
  res.json(updatedResume);
});

export { addResume, getResumesList, deleteResume, updateResume };