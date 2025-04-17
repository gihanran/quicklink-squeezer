
import { supabase } from '@/integrations/supabase/client';
import { 
  SocialMediaLink, 
  CreateSocialMediaLinkData 
} from '@/types/landingPage';

export const fetchSocialMediaLinks = async (landingPageId: string): Promise<SocialMediaLink[]> => {
  // Since the table isn't in the TypeScript types yet, we need to use a type assertion
  const { data, error } = await supabase
    .from('social_media_links')
    .select('*')
    .eq('landing_page_id', landingPageId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  
  // Use type assertion to tell TypeScript these are SocialMediaLink objects
  return (data || []) as SocialMediaLink[];
};

export const addSocialMediaLink = async (linkData: CreateSocialMediaLinkData): Promise<SocialMediaLink> => {
  // Again, use type assertion for the table name
  const { data, error } = await supabase
    .from('social_media_links')
    .insert(linkData)
    .select()
    .single();

  if (error) throw error;
  
  return data as SocialMediaLink;
};

export const updateSocialMediaLink = async (id: string, updates: Partial<SocialMediaLink>): Promise<SocialMediaLink> => {
  const { data, error } = await supabase
    .from('social_media_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  
  return data as SocialMediaLink;
};

export const deleteSocialMediaLink = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('social_media_links')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
