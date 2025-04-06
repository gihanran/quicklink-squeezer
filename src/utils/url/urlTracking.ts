
import { supabase } from "@/integrations/supabase/client";

// Track visit to a shortened URL - now tracks visits from all browsers
export const trackVisit = async (shortCode: string): Promise<boolean> => {
  try {
    // First, get the current URL data
    const { data, error } = await supabase
      .from('short_urls')
      .select('visits')
      .eq('short_code', shortCode)
      .single();
    
    if (error) throw error;
    
    // Increment the visit counter for all browsers
    const visits = (data?.visits || 0) + 1;
    
    // Update the URL with the new visit count
    const { error: updateError } = await supabase
      .from('short_urls')
      .update({ visits })
      .eq('short_code', shortCode);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error tracking URL visit:', error);
    return false;
  }
};
