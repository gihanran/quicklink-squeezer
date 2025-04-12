
import { supabase } from "@/integrations/supabase/client";
import { CreateLandingPageLinkData, LandingPageLink } from "@/types/landingPage";

export const fetchPageLinks = async (landingPageId: string): Promise<LandingPageLink[]> => {
  const { data, error } = await supabase
    .from('landing_page_links')
    .select('*')
    .eq('landing_page_id', landingPageId)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addPageLink = async (linkData: CreateLandingPageLinkData): Promise<LandingPageLink> => {
  // First check if the page already has 5 links
  const { data: existingLinks, error: countError } = await supabase
    .from('landing_page_links')
    .select('id', { count: 'exact' })
    .eq('landing_page_id', linkData.landing_page_id);

  if (countError) throw countError;
  
  if (existingLinks && existingLinks.length >= 5) {
    throw new Error('Maximum of 5 links allowed per landing page');
  }

  // If under the limit, add the new link
  const { data, error } = await supabase
    .from('landing_page_links')
    .insert(linkData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePageLink = async (id: string, updates: Partial<LandingPageLink>): Promise<LandingPageLink> => {
  const { data, error } = await supabase
    .from('landing_page_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePageLink = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('landing_page_links')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateLinkOrders = async (links: { id: string, display_order: number }[]): Promise<void> => {
  // Update each link with its new display order
  const promises = links.map(link => 
    supabase
      .from('landing_page_links')
      .update({ display_order: link.display_order })
      .eq('id', link.id)
  );
  
  await Promise.all(promises);
};
