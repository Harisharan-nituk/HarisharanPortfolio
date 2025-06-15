// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Corrected import for bcryptjs
import crypto from 'crypto'; // Import the crypto module

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // Emails should be unique
      match: [ // Basic email validation
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // By default, don't return password field when querying users
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // Default to not an admin
    },
     passwordResetToken: String,
    passwordResetExpire: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Middleware to hash password before saving a new user
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// --- NEW METHOD TO GENERATE AND HASH PASSWORD RESET TOKEN ---
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (e.g., 15 minutes)
  this.passwordResetExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // Return the unhashed token
};



const User = mongoose.model('User', userSchema);

export default User;