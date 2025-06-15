// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Your User model

// Middleware to protect routes - verifies token and attaches user to request
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      // process.env.JWT_SECRET is crucial here (should be in your .env file)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID payload, excluding the password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, user not found for this token');
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401); // Unauthorized
      // Send a more specific error if token failed verification (e.g., expired)
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Not authorized, token failed (invalid signature)');
      } else if (error.name === 'TokenExpiredError') {
        throw new Error('Not authorized, token expired');
      }
      throw new Error('Not authorized, token verification failed'); // General fallback
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token provided');
  }
});

// Middleware to check for admin users
const admin = (req, res, next) => {
  // Assumes 'protect' middleware has already run and set req.user
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed
  } else {
    res.status(403); // Forbidden - user is authenticated but not an admin
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };