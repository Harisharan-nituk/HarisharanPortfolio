// backend/controllers/skillCategoryController.js
import asyncHandler from 'express-async-handler';
import SkillCategory from '../models/SkillCategory.js';

// @desc    Create a new skill category
// @route   POST /api/skillcategories
// @access  Admin
export const addSkillCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required.');
  }
  const categoryExists = await SkillCategory.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error(`Category '${name}' already exists.`);
  }
  const skillCategory = new SkillCategory({
    name,
    skills: [], // Initialize with empty skills
   
  });
  const createdCategory = await skillCategory.save();
  res.status(201).json(createdCategory);
});

// @desc    Get all skill categories
// @route   GET /api/skillcategories
// @access  Public
export const getSkillCategories = asyncHandler(async (req, res) => {
  const categories = await SkillCategory.find({}).sort({ name: 1 });
  res.json(categories);
});

// @desc    Get a single skill category by ID
// @route   GET /api/skillcategories/:id
// @access  Public
export const getSkillCategoryById = asyncHandler(async (req, res) => {
  const category = await SkillCategory.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error('Skill category not found.');
  }
});

// @route   PUT /api/skillcategories/:id
// @access  Admin
export const updateSkillCategory = asyncHandler(async (req, res) => {
  const { name} = req.body;
  const category = await SkillCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Skill category not found.');
  }
  if (name && name !== category.name) {
    const categoryExists = await SkillCategory.findOne({ name });
    if (categoryExists && categoryExists._id.toString() !== category._id.toString()) {
      res.status(400);
      throw new Error(`Category name '${name}' already taken.`);
    }
    category.name = name;
  }
 
  // Note: We are NOT directly updating category.skills here.
  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// @desc    Delete a skill category
// @route   DELETE /api/skillcategories/:id
// @access  Admin
export const deleteSkillCategory = asyncHandler(async (req, res) => {
  const category = await SkillCategory.findById(req.params.id);
  if (category) {
    await SkillCategory.deleteOne({ _id: req.params.id });
    res.json({ message: `Skill category '${category.name}' removed.` });
  } else {
    res.status(404);
    throw new Error('Skill category not found.');
  }
});

// @desc    Add a skill (string) to a specific category
// @route   POST /api/skillcategories/:categoryId/skills
// @access  Private/Admin
export const addSkillToCategory = asyncHandler(async (req, res) => {
  const { name } = req.body; // Expecting just the skill name (string)
  const { categoryId } = req.params;

  if (!name || name.trim() === '') {
    res.status(400);
    throw new Error('Skill name is required.');
  }

  const category = await SkillCategory.findById(categoryId);

  if (category) {
    const skillNameTrimmed = name.trim();
    const skillExists = category.skills.find(
      (skill) => skill.toLowerCase() === skillNameTrimmed.toLowerCase()
    );

    if (skillExists) {
      res.status(400);
      throw new Error(`Skill '${skillNameTrimmed}' already exists in category '${category.name}'.`);
    }

    category.skills.push(skillNameTrimmed);
    await category.save();
    // Return the updated category or just the added skill name for confirmation
    res.status(201).json({ name: skillNameTrimmed }); // Returning an object with name for consistency in frontend
  } else {
    res.status(404);
    throw new Error('Skill category not found');
  }
});

// @desc    Delete a specific skill (string) from a category
// @route   DELETE /api/skillcategories/:categoryId/skills/:skillName
// @access  Private/Admin
export const deleteSkillFromCategory = asyncHandler(async (req, res) => {
  const { categoryId, skillName } = req.params; // skillName is a string from the URL

  const category = await SkillCategory.findById(categoryId);

  if (category) {
    const initialLength = category.skills.length;
    // Mongoose .pull() removes all instances of a value from an array
    category.skills.pull(skillName);
    await category.save();

    if (category.skills.length === initialLength) {
      res.status(404);
      throw new Error(`Skill '${skillName}' not found in category '${category.name}'.`);
    }
    res.json({ message: `Skill '${skillName}' removed from category successfully` });
  } else {
    res.status(404);
    throw new Error('Skill category not found');
  }
});

// All functions are individually exported with `export const ...`