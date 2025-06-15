// backend/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // To use variables from .env file

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
      // useCreateIndex: true, // Not needed for Mongoose 6+
    });
    
  } catch (error) {
    
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;