// backend/controllers/achievementController.js
import asyncHandler from 'express-async-handler';
import Achievement from '../models/Achievement.js';

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({}).sort({ displayOrder: 1, createdAt: -1 });
  res.json(achievements);
});

// @desc    Add a new achievement
// @route   POST /api/achievements
// @access  Admin
const addAchievement = asyncHandler(async (req, res) => {
  const { description, displayOrder } = req.body;
  if (!description) {
    res.status(400);
    throw new Error('Description is required.');
  }
  const achievement = await Achievement.create({ description, displayOrder });
  res.status(201).json(achievement);
});

// @desc    Update an achievement
// @route   PUT /api/achievements/:id
// @access  Admin
const updateAchievement = asyncHandler(async (req, res) => {
  const { description, displayOrder } = req.body;
  const achievement = await Achievement.findById(req.params.id);

  if (achievement) {
    achievement.description = description || achievement.description;
    achievement.displayOrder = displayOrder !== undefined ? displayOrder : achievement.displayOrder;
    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } else {
    res.status(404);
    throw new Error('Achievement not found');
  }
});

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Admin
const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (achievement) {
    await Achievement.deleteOne({ _id: req.params.id });
    res.json({ message: 'Achievement removed' });
  } else {
    res.status(404);
    throw new Error('Achievement not found');
  }
});

export { getAchievements, addAchievement, updateAchievement, deleteAchievement };