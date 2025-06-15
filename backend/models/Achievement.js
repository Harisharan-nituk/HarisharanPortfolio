// backend/models/Achievement.js
import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Achievement description is required'],
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ displayOrder: 1 });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;