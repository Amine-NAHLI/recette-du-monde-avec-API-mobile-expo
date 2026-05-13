import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oucgemkudqdxqwlebspz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91Y2dlbWt1ZHFkeHF3bGVic3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzU3NzcsImV4cCI6MjA5NDI1MTc3N30.cFUhivO1XJNxEZvhius9CcIgZ1YLum20L_04XYH-RV8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
