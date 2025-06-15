// backend/controllers/educationController.js
import asyncHandler from 'express-async-handler';
import Education from '../models/Education.js'; // Your Education model

// @desc    Add a new education entry
// @route   POST /api/education
// @access  Admin (to be secured later)
const addEducation = asyncHandler(async (req, res) => {
  const {
    degree,
    institution,
    location,
    startDate,
    endDate,
    gpa,
    description,
  } = req.body;

  if (!degree || !institution || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide degree, institution, start date, and end date.');
  }

  const educationEntry = new Education({
    degree,
    institution,
    location,
    startDate,
    endDate,
    gpa,
    description,
    // user: req.user._id // If linking to an admin user, to be added with authentication
  });

  try {
    const createdEducationEntry = await educationEntry.save();
    res.status(201).json(createdEducationEntry);
  } catch (error) {
    res.status(400); // Or 500 depending on the error
    throw new Error('Error saving education entry: ' + error.message);
  }
});

// @desc    Get all education entries
// @route   GET /api/education
// @access  Public
const getEducationHistory = asyncHandler(async (req, res) => {
  // You might want to sort them, e.g., by endDate or startDate
  // For example, to sort by end date descending (most recent first):
  // const educationHistory = await Education.find({}).sort({ endDate: -1 });
  // For now, let's sort by createdAt (when it was added to DB)
  const educationHistory = await Education.find({}).sort({ createdAt: -1 });
  res.json(educationHistory);
});

// @desc    Get a single education entry by ID
// @route   GET /api/education/:id
// @access  Public (or Admin if only needed for updates)
const getEducationById = asyncHandler(async (req, res) => {
  const educationEntry = await Education.findById(req.params.id);

  if (educationEntry) {
    res.json(educationEntry);
  } else {
    res.status(404);
    throw new Error('Education entry not found');
  }
});

// @desc    Update an education entry
// @route   PUT /api/education/:id
// @access  Admin (to be secured later)
const updateEducation = asyncHandler(async (req, res) => {
  const educationEntry = await Education.findById(req.params.id);

  if (!educationEntry) {
    res.status(404);
    throw new Error('Education entry not found');
  }

  const {
    degree,
    institution,
    location,
    startDate,
    endDate,
    gpa,
    description,
  } = req.body;

  educationEntry.degree = degree || educationEntry.degree;
  educationEntry.institution = institution || educationEntry.institution;
  educationEntry.location = location !== undefined ? location : educationEntry.location;
  educationEntry.startDate = startDate || educationEntry.startDate;
  educationEntry.endDate = endDate || educationEntry.endDate;
  educationEntry.gpa = gpa !== undefined ? gpa : educationEntry.gpa;
  educationEntry.description = description !== undefined ? description : educationEntry.description;

  try {
    const updatedEducationEntry = await educationEntry.save();
    res.json(updatedEducationEntry);
  } catch (error) {
    res.status(400); // Or 500
    throw new Error('Error updating education entry: ' + error.message);
  }
});

// @desc    Delete an education entry
// @route   DELETE /api/education/:id
// @access  Admin (to be secured later)
const deleteEducation = asyncHandler(async (req, res) => {
  const educationEntry = await Education.findById(req.params.id);

  if (educationEntry) {
    try {
      await Education.deleteOne({ _id: req.params.id }); // Mongoose 6+ prefer deleteOne
      res.json({ message: 'Education entry removed successfully' });
    } catch (error) {
      res.status(500);
      throw new Error('Error removing education entry: ' + error.message);
    }
  } else {
    res.status(404);
    throw new Error('Education entry not found');
  }
});

export {
  addEducation,
  getEducationHistory,
  getEducationById,
  updateEducation,
  deleteEducation,
};