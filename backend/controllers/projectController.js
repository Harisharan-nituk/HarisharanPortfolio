// backend/controllers/projectController.js
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Project from '../models/Project.js';
import { supabase } from '../config/supabaseConfig.js';

// This middleware uses memory storage to handle the file before uploading to Supabase
const projectImageStorage = multer.memoryStorage();
const projectImageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Please upload only images.'), false);
  }
};
export const uploadProjectImageMiddleware = multer({
  storage: projectImageStorage,
  fileFilter: projectImageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single('projectImage');


const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;

// @desc    Add a new project
// @route   POST /api/projects
// @access  Admin
const addProject = asyncHandler(async (req, res) => {
  const { title, description, projectLink, githubUrl, technologies } = req.body;
  if (!title || !description) {
    res.status(400);
    throw new Error('Project title and description are required.');
  }

  let imageUrl = '';
  let storedImageFilename = '';

  if (req.file) {
    const uniqueFilename = `${uuidv4()}-${req.file.originalname}`;
    const filePathInBucket = `projects/${uniqueFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePathInBucket, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });
      
    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      res.status(500);
      throw new Error(`Failed to upload project image: ${uploadError.message}`);
    }

    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePathInBucket);
    imageUrl = urlData.publicUrl;
    storedImageFilename = filePathInBucket;
  }

  const project = new Project({
    title,
    description,
    projectLink,
    githubUrl,
    technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
    imageUrl,
    storedImageFilename,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.json(projects);
});

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Admin
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, description, projectLink, githubUrl, technologies } = req.body;
  project.title = title || project.title;
  project.description = description || project.description;
  project.projectLink = projectLink !== undefined ? projectLink : project.projectLink;
  project.githubUrl = githubUrl !== undefined ? githubUrl : project.githubUrl;
  project.technologies = technologies ? technologies.split(',').map(tech => tech.trim()) : project.technologies;

  if (req.file) {
    const oldStoredFilename = project.storedImageFilename;

    const newUniqueFilename = `${uuidv4()}-${req.file.originalname}`;
    const newFilePathInBucket = `projects/${newUniqueFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newFilePathInBucket, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) {
        console.error('Supabase Update-Upload Error:', uploadError);
        res.status(500);
        throw new Error(`Failed to upload new project image: ${uploadError.message}`);
    }
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newFilePathInBucket);
    
    project.imageUrl = urlData.publicUrl;
    project.storedImageFilename = newFilePathInBucket;

    if (oldStoredFilename) {
        const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldStoredFilename]);
        if (deleteError) {
            console.error(`Failed to delete old Supabase file '${oldStoredFilename}': ${deleteError.message}`);
        }
    }
  }
  
  const updatedProject = await project.save();
  res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (project) {
    if (project.storedImageFilename) {
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([project.storedImageFilename]);
       if (deleteError) {
        console.error(`Could not delete file from Supabase: ${deleteError.message}`);
      }
    }
    await Project.deleteOne({ _id: project._id });
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export { addProject, getProjects, getProjectById, updateProject, deleteProject };



