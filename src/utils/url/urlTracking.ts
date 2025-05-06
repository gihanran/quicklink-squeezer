
import { supabase } from "@/integrations/supabase/client";

// Track visit to a shortened URL - now track visits more reliably
export const trackVisit = async (shortCode: string): Promise<boolean> => {
  try {
    // First, get the current URL data
    const { data, error } = await supabase
      .from('short_urls')
      .select('id, visits')
      .eq('short_code', shortCode)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching URL for tracking:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No URL found with short code:', shortCode);
      return false;
    }
    
    // Increment the visit counter
    const visits = (data?.visits || 0) + 1;
    
    // Update the URL with the new visit count
    const { error: updateError } = await supabase
      .from('short_urls')
      .update({ visits })
      .eq('id', data.id);
    
    if (updateError) {
      console.error('Error updating URL visits:', updateError);
      throw updateError;
    }
    
    // Log the visit for analytics
    try {
      await supabase
        .from('url_visits')
        .insert({ 
          short_url_id: data.id,
          user_agent: navigator.userAgent
        });
      
      console.log(`Successfully logged visit for ${shortCode}`);
    } catch (logError) {
      console.error('Error logging URL visit:', logError);
      // Don't fail the whole tracking if just the log fails
    }
    
    console.log(`Successfully tracked visit for ${shortCode}. New total: ${visits}`);
    return true;
  } catch (error) {
    console.error('Error tracking URL visit:', error);
    return false;
  }
};
