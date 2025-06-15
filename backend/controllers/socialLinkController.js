import asyncHandler from 'express-async-handler';
import SocialLink from '../models/SocialLink.js';

// @desc    Add a new social link
const addSocialLink = asyncHandler(async (req, res) => {
  const { name, url, label, iconName, isEnabled, displayOrder } = req.body;
  if (!name || !url || !iconName) {
    res.status(400);
    throw new Error('Name, URL, and Icon Name are required.');
  }
  const linkExists = await SocialLink.findOne({ name });
  if (linkExists) {
    res.status(400);
    throw new Error('A social link with this name already exists.');
  }
  const socialLink = await SocialLink.create({ name, url, label: label || name, iconName, isEnabled, displayOrder });
  res.status(201).json(socialLink);
});

// @desc    Get all ENABLED social links for public view
const getSocialLinks = asyncHandler(async (req, res) => {
  const links = await SocialLink.find({ isEnabled: true }).sort({ displayOrder: 1, name: 1 });
  res.json(links);
});

// @desc    Get ALL social links for admin view
const getAdminSocialLinks = asyncHandler(async (req, res) => {
  const links = await SocialLink.find({}).sort({ displayOrder: 1, name: 1 });
  res.json(links);
});

// @desc    Get a social link by ID
const getSocialLinkById = asyncHandler(async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  if (link) {
    res.json(link);
  } else {
    res.status(404);
    throw new Error('Social link not found');
  }
});

// @desc    Update a social link
const updateSocialLink = asyncHandler(async (req, res) => {
  const { name, url, label, iconName, isEnabled, displayOrder } = req.body;
  const link = await SocialLink.findById(req.params.id);

  if (link) {
    if (name && name !== link.name) {
      const linkExists = await SocialLink.findOne({ name });
      if (linkExists && linkExists._id.toString() !== link._id.toString()) {
        res.status(400);
        throw new Error('Another social link with this name already exists.');
      }
      link.name = name;
    }
    link.url = url || link.url;
    link.label = label !== undefined ? label : link.label;
    link.iconName = iconName || link.iconName;
    link.isEnabled = isEnabled !== undefined ? isEnabled : link.isEnabled;
    link.displayOrder = displayOrder !== undefined ? displayOrder : link.displayOrder;
    const updatedLink = await link.save();
    res.json(updatedLink);
  } else {
    res.status(404);
    throw new Error('Social link not found');
  }
});

// @desc    Delete a social link
const deleteSocialLink = asyncHandler(async (req, res) => {
  const link = await SocialLink.findById(req.params.id);
  if (link) {
    await SocialLink.deleteOne({ _id: req.params.id });
    res.json({ message: 'Social link removed' });
  } else {
    res.status(404);
    throw new Error('Social link not found');
  }
});

export {
  addSocialLink,
  getSocialLinks,
  getAdminSocialLinks,
  getSocialLinkById,
  updateSocialLink,
  deleteSocialLink,
};