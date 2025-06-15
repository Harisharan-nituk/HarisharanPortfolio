// backend/controllers/authController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Your User model
import generateToken from '../utils/generateToken.js'; // Your JWT generator
import sendEmail from '../utils/emailSender.js'; // For sending reset links
import crypto from 'crypto'; // For token generation
// @desc    Register a new user (e.g., for the first admin user)
// @route   POST /api/users/register  (or /api/auth/register - we'll define the route later)
// @access  Public (for initial setup, then could be restricted or removed)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } =req.body;// You might want to add an isAdmin flag here if creating other users
                                    // or a way to set the first user as admin.
                                    // For simplicity, let's assume the first registered user can be an admin.
                                    // Or, you can manually set isAdmin: true in MongoDB for your user.

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields (name, email, password)');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400); // Bad request
    throw new Error('User already exists with this email');
  }

  // Create user
  // For a portfolio, you might want the first registered user to be an admin.
  // Or, you can create an admin user directly in the database or via a seed script.
  // Let's allow setting isAdmin via request body for flexibility for now,
  // but this route should be heavily protected or used only for initial setup.
  const isAdminRequest = req.body.isAdmin === true; // Check if isAdmin is explicitly sent as true

  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save middleware in User.js
    isAdmin: isAdminRequest, // Set isAdmin based on request, or default to false
  });

  if (user) {
    // Return user data and token (excluding password)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user (login) & get token
// @route   POST /api/users/login (or /api/auth/login)
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user by email
  // We need to explicitly select the password because it's set to 'select: false' in the model
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    // Password matches
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // Generate and send JWT
    });
  } else {
    // User not found or password does not match
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});


// @desc    Get user profile (Example of a protected route later)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user will be available after authentication middleware runs
  const user = await User.findById(req.user._id); // req.user is set by the protect middleware

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    // To prevent email enumeration, we send a success response even if the user doesn't exist.
    // The user gets the same feedback regardless of whether the email is in the DB.
    return res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
  }

  // Get reset token (the unhashed version)
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL for the frontend
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const message = `
    <h1>Password Reset Request</h1>
    <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
    <p>Please click on the following link, or paste it into your browser to complete the process within 15 minutes of receiving it:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message
    });
    res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Email could not be sent');
  }
});


// --- NEW: RESET PASSWORD CONTROLLER ---
// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // Generate a new token for immediate login if desired, or just confirm success
  res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please log in with your new password.',
  });
});



// Export controller functions
export { registerUser, authUser, getUserProfile, forgotPassword, resetPassword };
