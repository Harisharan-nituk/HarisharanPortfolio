// portfolio_py/backend/models/Certificate.js
import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Certificate name is required'],
      trim: true,
    },
    issuingOrganization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: { // Web-accessible path to the image
      type: String,
      required: [true, 'Certificate image is required'],
    },
    storedImageFilename: { // Actual filename on disk for management
      type: String,
      required: [true, 'Stored image filename is required'],
    },
        mimetype: { type: String, required: true }, // <-- ADD THIS LINE

    credentialId: {
      type: String,
      trim: true,
      sparse: true, // Optional: allows null/undefined values if not unique
    },
    credentialUrl: {
      type: String,
      trim: true,
    },
    dateIssued: { // Could be a String like "Month Year" or a Date type
      type: String, // Or Date, adjust as needed
      trim: true,
    },
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If you want to associate with a user
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;