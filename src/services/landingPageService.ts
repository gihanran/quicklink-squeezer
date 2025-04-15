
import { supabase } from '@/integrations/supabase/client';
import { LandingPage, CreateLandingPageData } from '@/types/landingPage';

export const fetchLandingPages = async (): Promise<LandingPage[]> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  // Add default values for new fields if they don't exist
  return data.map(page => ({
    ...page,
    background_image_url: page.background_image_url || null,
    button_style: page.button_style || 'default',
    social_links: page.social_links || []
  }) as LandingPage);
};

export const createLandingPage = async (pageData: CreateLandingPageData): Promise<LandingPage> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .insert(pageData)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    background_image_url: data.background_image_url || null,
    button_style: data.button_style || 'default',
    social_links: data.social_links || []
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
  
  return {
    ...data,
    background_image_url: data.background_image_url || null,
    button_style: data.button_style || 'default',
    social_links: data.social_links || []
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
  
  return {
    ...data,
    background_image_url: data.background_image_url || null,
    button_style: data.button_style || 'default',
    social_links: data.social_links || []
  } as LandingPage;
};
