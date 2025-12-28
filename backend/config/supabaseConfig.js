// backend/config/supabaseConfig.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Create a single Supabase client for interacting with your project
// Only create the client if both URL and key are provided (optional for deployment)
let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('Supabase client initialization failed:', error.message);
    supabase = null;
  }
} else {
  console.warn('Supabase environment variables not set. File upload features will be disabled.');
}

// Helper function to check if Supabase is available
export const isSupabaseConfigured = () => {
  return supabase !== null && supabaseUrl && supabaseKey;
};

export { supabase };