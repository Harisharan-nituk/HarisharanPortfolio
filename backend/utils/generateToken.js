// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Check if JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  // The first argument to jwt.sign() is the payload (data you want to include in the token).
  // The second argument is your JWT_SECRET.
  // The third argument is an options object, including expiration time.
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d', // Default to 30 days if not set in .env
    });
  } catch (error) {
    console.error('JWT sign error:', error.message);
    throw new Error(`Failed to sign JWT token: ${error.message}`);
  }
};

export default generateToken;