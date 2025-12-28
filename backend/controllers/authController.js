import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/emailSender.js';
import crypto from 'crypto';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields (name, email, password)');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Check if this is the first user ever.
  const isFirstAccount = (await User.countDocuments({})) === 0;

  const user = await User.create({
    name,
    email,
    password,
    // If it's the first account, make it an admin. Otherwise, never.
    isAdmin: isFirstAccount,
  });

  if (user) {
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
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables');
    res.status(500);
    throw new Error('Server configuration error: JWT_SECRET is missing');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log(`Login attempt failed: User not found with email: ${email}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check if user has a password (should always be true, but safety check)
  if (!user.password) {
    console.error(`Login attempt failed: User ${email} has no password stored`);
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Compare passwords
  const isPasswordMatch = await user.matchPassword(password);
  
  if (!isPasswordMatch) {
    console.log(`Login attempt failed: Password mismatch for email: ${email}`);
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Generate token
  try {
    const token = generateToken(user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } catch (tokenError) {
    console.error('Token generation failed:', tokenError.message);
    res.status(500);
    throw new Error('Failed to generate authentication token');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

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

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email });

  // Always return the same message for security (don't reveal if user exists)
  const successMessage = 'If a user with that email exists, a reset link has been sent.';

  if (!user) {
    console.log(`Forgot password request for non-existent email: ${email}`);
    return res.status(200).json({ message: successMessage });
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Build reset URL - use FRONTEND_URL from .env
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/resetpassword/${resetToken}`;

  console.log(`Password reset requested for user: ${user.email}`);
  console.log(`Reset URL will be: ${resetUrl}`);

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
    console.log(`Password reset email sent successfully to: ${user.email}`);
    res.status(200).json({ message: successMessage });
  } catch (err) {
    console.error('Failed to send password reset email:', err.message);
    // Clear the reset token if email failed
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    // Return error response
    res.status(500);
    throw new Error(`Email could not be sent: ${err.message}`);
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
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

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. Please log in with your new password.',
  });
});

export { registerUser, authUser, getUserProfile, forgotPassword, resetPassword };