import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use the provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pcokghscqiuewqxcipoe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2tnaHNjcWl1ZXdxeGNpcG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODgwMTIsImV4cCI6MjA4ODU2NDAxMn0.-LRvGd1xTtrNzRO3SaqPtcu2QUEpkVb66BSnk2FtP-M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
