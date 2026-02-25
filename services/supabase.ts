
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zuckdrjzysssrzxnhemp.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Y2tkcmp6eXNzc3J6eG5oZW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MjQwMzcsImV4cCI6MjA4NzQwMDAzN30.t5552iOWAHkYrGtZ2OEnMHo8FJfCZ3zi4LYJbKuK4-4';

export const supabase = createClient(supabaseUrl, supabaseKey);
