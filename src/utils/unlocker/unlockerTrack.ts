
import { supabase } from "@/integrations/supabase/client";

// Track a click on a URL unlocker
export const trackUnlockerClick = async (id: string): Promise<boolean> => {
  try {
    // First, get the current value
    const { data: unlocker, error: fetchError } = await supabase
      .from('url_unlockers')
      .select('clicks')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Now update with the incremented value
    const { error } = await supabase
      .from('url_unlockers')
      .update({ clicks: (unlocker?.clicks || 0) + 1 })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error tracking unlocker click:', error);
    return false;
  }
};

// Track a successful unlock
export const trackUnlockerSuccess = async (id: string): Promise<boolean> => {
  try {
    // First, get the current value
    const { data: unlocker, error: fetchError } = await supabase
      .from('url_unlockers')
      .select('unlocks')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Now update with the incremented value
    const { error } = await supabase
      .from('url_unlockers')
      .update({ unlocks: (unlocker?.unlocks || 0) + 1 })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error tracking unlocker success:', error);
    return false;
  }
};
