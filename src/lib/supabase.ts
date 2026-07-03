import { createClient } from '@supabase/supabase-js';

// Hardcoded public credentials so the app works out-of-the-box on public hosts
const supabaseUrl = 'https://jgjwhuyrdjkhkhesxxbw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnandodXlyZGpraGtoZXN4eGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODU5MjksImV4cCI6MjA5NzQ2MTkyOX0.X2yX8SJQtCAMiyUj48aanQOuyM3KAoltI7a8GwZHuaM';

export const isSupabaseConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
