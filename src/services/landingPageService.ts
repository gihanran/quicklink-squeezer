
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
  theme_color: string | null;
  created_at: string;
  updated_at: string;
  views: number;
  background_image_url?: string | null;
  button_style?: 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';
  social_links?: any[];
}

export const fetchLandingPages = async (): Promise<LandingPage[]> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Transform database data to our LandingPage type with default values
  return (data as DatabaseLandingPage[]).map(page => ({
    ...page,
    background_image_url: page.background_image_url || null,
    button_style: page.button_style || 'default',
    social_links: page.social_links || []
  })) as LandingPage[];
};

export const createLandingPage = async (pageData: CreateLandingPageData): Promise<LandingPage> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .insert(pageData)
    .select()
    .single();
    
  if (error) throw error;
  
  // Transform to our LandingPage type with default values
  const dbPage = data as DatabaseLandingPage;
  return {
    ...dbPage,
    background_image_url: dbPage.background_image_url || null,
    button_style: dbPage.button_style || 'default',
    social_links: dbPage.social_links || []
  } as LandingPage;
};

export const updateLandingPage = async (id: string, updates: Partial<LandingPage>): Promise<LandingPage> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  // Transform to our LandingPage type with default values
  const dbPage = data as DatabaseLandingPage;
  return {
    ...dbPage,
    background_image_url: dbPage.background_image_url || null,
    button_style: dbPage.button_style || 'default',
    social_links: dbPage.social_links || []
  } as LandingPage;
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
  
  // Transform to our LandingPage type with default values
  const dbPage = data as DatabaseLandingPage;
  return {
    ...dbPage,
    background_image_url: dbPage.background_image_url || null,
    button_style: dbPage.button_style || 'default',
    social_links: dbPage.social_links || []
  } as LandingPage;
};
