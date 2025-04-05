
import { supabase } from "@/integrations/supabase/client";

// Track visit to a shortened URL - now only counts visits from Chrome browser
export const trackVisit = async (shortCode: string): Promise<boolean> => {
  try {
    // First, get the current URL data
    const { data, error } = await supabase
      .from('short_urls')
      .select('visits')
      .eq('short_code', shortCode)
      .single();
    
    if (error) throw error;
    
    // Check browser before incrementing
    const isChrome = typeof navigator !== 'undefined' && 
      navigator.userAgent.indexOf("Chrome") > -1;
    
    if (!isChrome) {
      console.log('Visit not tracked - not using Chrome browser');
      return false;
    }
    
    // Increment the visit counter only for Chrome
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
