
import { supabase } from "@/integrations/supabase/client";

// Delete a URL unlocker
export const deleteUnlocker = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('url_unlockers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting URL unlocker:', error);
    return false;
  }
};

// Update unlocker expiration date
export const updateUnlockerExpiration = async (id: string, additionalDays: number): Promise<boolean> => {
  try {
    const { data: unlocker, error: fetchError } = await supabase
      .from('url_unlockers')
      .select('expiration_date')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const currentExpiration = new Date(unlocker.expiration_date);
    currentExpiration.setDate(currentExpiration.getDate() + additionalDays);
    
    const { error } = await supabase
      .from('url_unlockers')
      .update({ expiration_date: currentExpiration.toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating unlocker expiration:', error);
    return false;
  }
};
