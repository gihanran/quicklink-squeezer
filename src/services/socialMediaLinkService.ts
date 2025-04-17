
import { supabase } from '@/integrations/supabase/client';
import { 
  SocialMediaLink, 
  CreateSocialMediaLinkData 
} from '@/types/landingPage';

export const fetchSocialMediaLinks = async (landingPageId: string): Promise<SocialMediaLink[]> => {
  // Use type assertion for the table name with any to bypass type checking
  const { data, error } = await (supabase
    .from('social_media_links' as any)
    .select('*')
    .eq('landing_page_id', landingPageId)
    .order('display_order', { ascending: true }));

  if (error) throw error;
  
  // First convert to unknown, then to the expected type for safer type casting
  return (data || []) as unknown as SocialMediaLink[];
};

export const addSocialMediaLink = async (linkData: CreateSocialMediaLinkData): Promise<SocialMediaLink> => {
  // Use type assertion for the table name with any
  const { data, error } = await (supabase
    .from('social_media_links' as any)
    .insert(linkData as any)
    .select()
    .single());

  if (error) throw error;
  
  // First convert to unknown, then to the expected type
  return data as unknown as SocialMediaLink;
};

export const updateSocialMediaLink = async (id: string, updates: Partial<SocialMediaLink>): Promise<SocialMediaLink> => {
  const { data, error } = await (supabase
    .from('social_media_links' as any)
    .update(updates as any)
    .eq('id', id)
    .select()
    .single());

  if (error) throw error;
  
  // First convert to unknown, then to the expected type
  return data as unknown as SocialMediaLink;
};

export const deleteSocialMediaLink = async (id: string): Promise<void> => {
  const { error } = await (supabase
    .from('social_media_links' as any)
    .delete()
    .eq('id', id));

  if (error) throw error;
};
