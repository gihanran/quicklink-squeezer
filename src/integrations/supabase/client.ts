
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ujdgttnmbqwvefemtjll.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZGd0dG5tYnF3dmVmZW10amxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDI2OTksImV4cCI6MjA1OTAxODY5OX0.sg9T4tlVSuQJwiNvsc_h0wCHIqcWHuoYMa5bECiH_Xg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
