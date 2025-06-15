// portfolio_py/backend/models/SocialLink.js
import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
      unique: true,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    label: {
      type: String,
      trim: true,
    },
    iconName: {
      type: String,
      trim: true,
      required: [true, 'Icon name is required for frontend display'],
    },
    isEnabled: {
      type: Boolean,
      default: true,
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

socialLinkSchema.index({ displayOrder: 1, name: 1 });

const SocialLink = mongoose.model('SocialLink', socialLinkSchema);
export default SocialLink;