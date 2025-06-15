// Harisharan_portfolio/backend/controllers/settingsController.js
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import GeneralSetting from '../models/GeneralSetting.js';
import { supabase } from '../config/supabaseConfig.js';

// --- This middleware setup is correct ---
const profilePhotoStorage = multer.memoryStorage();
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file! Please upload only images.'), false);
  }
};
export const uploadProfilePhotoMiddleware = multer({
  storage: profilePhotoStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
}).single('profilePhoto');

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;
// --- End of unchanged section ---

const getSettings = asyncHandler(async (req, res) => {
  const settings = await GeneralSetting.getSingleton();
  res.json(settings);
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await GeneralSetting.getSingleton();
  const {
    ownerName, jobTitle, specialization,
    homePageIntroParagraph, aboutMeIntroduction, aboutMePhilosophy
  } = req.body;

  settings.ownerName = ownerName !== undefined ? ownerName : settings.ownerName;
  settings.jobTitle = jobTitle !== undefined ? jobTitle : settings.jobTitle;
  settings.specialization = specialization !== undefined ? specialization : settings.specialization;
  settings.homePageIntroParagraph = homePageIntroParagraph !== undefined ? homePageIntroParagraph : settings.homePageIntroParagraph;
  if (aboutMeIntroduction !== undefined) {
    settings.aboutMeIntroduction = Array.isArray(aboutMeIntroduction)
      ? aboutMeIntroduction
      : aboutMeIntroduction.split('\n').filter(p => p.trim() !== '');
  }
  settings.aboutMePhilosophy = aboutMePhilosophy !== undefined ? aboutMePhilosophy : settings.aboutMePhilosophy;

  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

const uploadOrUpdateProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No profile photo file uploaded.');
  }

  const settings = await GeneralSetting.getSingleton();
  const oldStoredFilename = settings.storedProfilePhotoFilename;

  // Upload the new file first
  const newUniqueFilename = `${uuidv4()}-${req.file.originalname}`;
  const newFilePathInBucket = `profile/${newUniqueFilename}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(newFilePathInBucket, req.file.buffer, { contentType: req.file.mimetype });

  if (uploadError) {
    console.error('Supabase Profile Photo Upload Error:', uploadError);
    res.status(500);
    throw new Error(`Failed to upload profile photo: ${uploadError.message}`);
  }

  // If upload is successful, get the new public URL
  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newFilePathInBucket);

  // Update the document with new file details
  settings.profilePhotoUrl = urlData.publicUrl;
  settings.storedProfilePhotoFilename = newFilePathInBucket;
  
  const updatedSettings = await settings.save();

  // Now, safely delete the old file from Supabase
  if (oldStoredFilename && !oldStoredFilename.includes('default-profile.png')) {
    const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldStoredFilename]);
    if (deleteError) {
      console.error(`Failed to delete old Supabase file '${oldStoredFilename}': ${deleteError.message}`);
    }
  }

  res.json({
    message: 'Profile photo updated successfully',
    profilePhotoUrl: updatedSettings.profilePhotoUrl,
  });
});

export { getSettings, updateSettings, uploadOrUpdateProfilePhoto };