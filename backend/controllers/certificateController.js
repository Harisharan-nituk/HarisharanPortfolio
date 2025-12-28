// Harisharan_portfolio/backend/controllers/certificateController.js
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Certificate from '../models/Certificate.js';
w import { supabase, isSupabaseConfigured } from '../config/supabaseConfig.js';

// --- This middleware setup is correct ---
const certificateStorage = multer.memoryStorage();
const allowedFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images or PDFs are allowed.'), false);
  }
};
export const uploadCertificateImageMiddleware = multer({
  storage: certificateStorage,
  fileFilter: allowedFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('certificateImage');

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;
// --- End of unchanged section ---

export const addCertificate = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Certificate file (image or PDF) is required.');
  }
  const { name, issuingOrganization, description, credentialId, credentialUrl, dateIssued } = req.body;
  if (!name || !issuingOrganization) {
    res.status(400);
    throw new Error('Certificate name and issuing organization are required.');
  }

  // Check if Supabase is configured
  if (!isSupabaseConfigured() || !supabase) {
    res.status(503);
    throw new Error('File upload service is not configured. Please set SUPABASE_URL, SUPABASE_SERVICE_KEY, and SUPABASE_BUCKET_NAME environment variables.');
  }

  const uniqueFilename = `${uuidv4()}-${req.file.originalname}`;
  const filePathInBucket = `certificates/${uniqueFilename}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePathInBucket, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase Upload Error:', uploadError);
    res.status(500);
    throw new Error(`Failed to upload certificate file: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePathInBucket);

  const certificate = new Certificate({
    name,
    issuingOrganization,
    description,
    credentialId,
    credentialUrl,
    dateIssued,
    imageUrl: urlData.publicUrl,
    storedImageFilename: filePathInBucket,
    mimetype: req.file.mimetype,
  });
  const createdCertificate = await certificate.save();
  res.status(201).json(createdCertificate);
});

export const getCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({}).sort({ dateIssued: -1, createdAt: -1 });
  res.json(certificates);
});

export const updateCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  const { name, issuingOrganization, description, credentialId, credentialUrl, dateIssued } = req.body;
  certificate.name = name || certificate.name;
  certificate.issuingOrganization = issuingOrganization || certificate.issuingOrganization;
  certificate.description = description !== undefined ? description : certificate.description;
  certificate.credentialId = credentialId !== undefined ? credentialId : certificate.credentialId;
  certificate.credentialUrl = credentialUrl !== undefined ? credentialUrl : certificate.credentialUrl;
  certificate.dateIssued = dateIssued !== undefined ? dateIssued : certificate.dateIssued;

  if (req.file) {
    // Check if Supabase is configured
    if (!isSupabaseConfigured() || !supabase) {
      res.status(503);
      throw new Error('File upload service is not configured. Please set SUPABASE_URL, SUPABASE_SERVICE_KEY, and SUPABASE_BUCKET_NAME environment variables.');
    }

    const oldStoredFilename = certificate.storedImageFilename;

    // Upload new file first
    const newUniqueFilename = `${uuidv4()}-${req.file.originalname}`;
    const newFilePathInBucket = `certificates/${newUniqueFilename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newFilePathInBucket, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) {
        console.error('Supabase Update-Upload Error:', uploadError);
        res.status(500);
        throw new Error(`Failed to upload new certificate file: ${uploadError.message}`);
    }
    
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newFilePathInBucket);

    // Update the document with new file details
    certificate.imageUrl = urlData.publicUrl;
    certificate.storedImageFilename = newFilePathInBucket;
    certificate.mimetype = req.file.mimetype;

    // Safely delete the old file
    if (oldStoredFilename) {
        const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([oldStoredFilename]);
        if (deleteError) {
            console.error(`Failed to delete old Supabase file '${oldStoredFilename}': ${deleteError.message}`);
        }
    }
  }

  const updatedCertificate = await certificate.save();
  res.json(updatedCertificate);
});

export const deleteCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (certificate) {
    if (certificate.storedImageFilename && isSupabaseConfigured() && supabase) {
      const { error: deleteError } = await supabase.storage.from(BUCKET_NAME).remove([certificate.storedImageFilename]);
       if (deleteError) {
        console.error(`Could not delete file from Supabase: ${deleteError.message}`);
      }
    }
    await Certificate.deleteOne({ _id: certificate._id });
    res.json({ message: 'Certificate removed' });
  } else {
    res.status(404);
    throw new Error('Certificate not found');
  }
});