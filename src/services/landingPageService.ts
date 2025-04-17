
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, CreateLandingPageData } from '@/types/landingPage';

// Define a database interface that matches what's coming from Supabase
interface DatabaseLandingPage {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  slug: string;
  published: boolean | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
  views: number;
}

export const fetchLandingPages = async (): Promise<LandingPage[]> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Transform database data to our LandingPage type
  return data as LandingPage[];
};

export const createLandingPage = async (pageData: CreateLandingPageData): Promise<LandingPage> => {
  console.log("Creating landing page with data:", pageData); // Debug log
  
  const { data, error } = await supabase
    .from('landing_pages')
    .insert(pageData)
    .select()
    .single();
    
  if (error) throw error;
  
  return data as LandingPage;
};

export const updateLandingPage = async (id: string, updates: Partial<LandingPage>): Promise<LandingPage> => {
  console.log("Updating landing page with id:", id, "and updates:", updates); // Debug log
  
  const { data, error } = await supabase
    .from('landing_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  return data as LandingPage;
};

export const deleteLandingPage = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  
  return true;
};

export const fetchLandingPageBySlug = async (slug: string): Promise<LandingPage> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) throw error;
  
  return data as LandingPage;
};
