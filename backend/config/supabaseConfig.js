// backend/config/supabaseConfig.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Create a single Supabase client for interacting with your project
export const supabase = createClient(supabaseUrl, supabaseKey);