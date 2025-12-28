// backend/controllers/experienceController.js
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Experience from '../models/Experience.js';
import { supabase } from '../config/supabaseConfig.js';

// This middleware uses memory storage to handle the file before uploading to Supabase
const experienceLogoStorage = multer.memoryStorage();
const experienceLogoFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload only images.'), false);
  }
};
export const uploadExperienceLogoMiddleware = multer({
  storage: experienceLogoStorage,
  fileFilter: experienceLogoFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single('companyLogo');

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;

// @desc    Add a new experience
// @route   POST /api/experiences
// @access  Admin
const addExperience = asyncHandler(async (req, res) => {
  const { company, position, description, startDate, endDate, isCurrent, location, technologies } = req.body;
  
  if (!company || !position || !description || !startDate) {
    res.status(400);
    throw new Error('Company, position, description, and start date are required.');
  }

  let companyLogo = '';
  let storedLogoFilename = '';

  if (req.file) {
    if (!isSupabaseConfigured()) {
      res.status(503);
      throw new Error('File storage is not configured. Please configure Supabase to upload images.');
    }

    const uniqueFilename = `${uuidv4()}-${req.file.originalname}`;
    const filePathInBucket = `experiences/${uniqueFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePathInBucket, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });
      
    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      res.status(500);
      throw new Error(`Failed to upload company logo: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePathInBucket);
    companyLogo = urlData.publicUrl;
    storedLogoFilename = filePathInBucket;
  }

  const experience = new Experience({
    company,
    position,
    description,
    startDate,
    endDate: isCurrent === 'true' || isCurrent === true ? undefined : endDate,
    isCurrent: isCurrent === 'true' || isCurrent === true,
    location,
    technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
    companyLogo,
    storedLogoFilename,
  });

  const createdExperience = await experience.save();
  res.status(201).json(createdExperience);
});

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({}).sort({ startDate: -1 });
  res.json(experiences);
});

// @desc    Get a single experience by ID
// @route   GET /api/experiences/:id
// @access  Public
const getExperienceById = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (experience) {
    res.json(experience);
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Admin
const updateExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (!experience) {
    res.status(404);
    throw new Error('Experience not found');
  }

  const { company, position, description, startDate, endDate, isCurrent, location, technologies } = req.body;
  
  experience.company = company || experience.company;
  experience.position = position || experience.position;
  experience.description = description || experience.description;
  experience.startDate = startDate || experience.startDate;
  experience.endDate = (isCurrent === 'true' || isCurrent === true) ? undefined : (endDate !== undefined ? endDate : experience.endDate);
  experience.isCurrent = isCurrent === 'true' || isCurrent === true;
  experience.location = location !== undefined ? location : experience.location;
  experience.technologies = technologies ? technologies.split(',').map(tech => tech.trim()) : experience.technologies;

  if (req.file) {
    if (!supabase) {
      res.status(503);
      throw new Error('File storage is not configured. Please configure Supabase to upload images.');
    }

    const oldStoredFilename = experience.storedLogoFilename;

    const newUniqueFilename = `${uuidv4()}-${req.file.originalname}`;
    const newFilePathInBucket = `experiences/${newUniqueFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newFilePathInBucket, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) {
      console.error('Supabase Update-Upload Error:', uploadError);
      res.status(500);
      throw new Error(`Failed to upload new company logo: ${uploadError.message}`);
    }
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newFilePathInBucket);
    
    experience.companyLogo = urlData.publicUrl;
    experience.storedLogoFilename = newFilePathInBucket;

    if (oldStoredFilename) {
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldStoredFilename]);
      if (deleteError) {
        console.error(`Failed to delete old Supabase file '${oldStoredFilename}': ${deleteError.message}`);
      }
    }
  }
  
  const updatedExperience = await experience.save();
  res.json(updatedExperience);
});

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Admin
const deleteExperience = asyncHandler(async (req, res) => {
  const experience = await Experience.findById(req.params.id);
  if (experience) {
    if (experience.storedLogoFilename && supabase) {
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([experience.storedLogoFilename]);
      if (deleteError) {
        console.error(`Could not delete file from Supabase: ${deleteError.message}`);
      }
    }
    await Experience.deleteOne({ _id: experience._id });
    res.json({ message: 'Experience removed' });
  } else {
    res.status(404);
    throw new Error('Experience not found');
  }
});

export { addExperience, getExperiences, getExperienceById, updateExperience, deleteExperience };

