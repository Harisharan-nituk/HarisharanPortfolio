// backend/models/SkillCategory.js
import mongoose from 'mongoose';

const skillCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// skillCategorySchema.index({ name: 1 });
skillCategorySchema.index({  createdAt: -1 });

const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);
export default SkillCategory;