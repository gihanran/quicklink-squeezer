
import { supabase } from '@/integrations/supabase/client';
import { 
  SocialMediaLink, 
  CreateSocialMediaLinkData 
} from '@/types/landingPage';

export const fetchSocialMediaLinks = async (landingPageId: string): Promise<SocialMediaLink[]> => {
  const { data, error } = await supabase
    .from('social_media_links')
    .select('*')
    .eq('landing_page_id', landingPageId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addSocialMediaLink = async (linkData: CreateSocialMediaLinkData): Promise<SocialMediaLink> => {
  const { data, error } = await supabase
    .from('social_media_links')
    .insert(linkData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateSocialMediaLink = async (id: string, updates: Partial<SocialMediaLink>): Promise<SocialMediaLink> => {
  const { data, error } = await supabase
    .from('social_media_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSocialMediaLink = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('social_media_links')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
