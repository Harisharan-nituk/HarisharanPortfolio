// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // The first argument to jwt.sign() is the payload (data you want to include in the token).
  // The second argument is your JWT_SECRET.
  // The third argument is an options object, including expiration time.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d', // Default to 30 days if not set in .env
  });
};

export default generateToken;