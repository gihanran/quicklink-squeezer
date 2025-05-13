
import { supabase } from "@/integrations/supabase/client";
import { UrlUnlocker } from "./types";
import { checkAuthentication, handleError, transformUnlockerData } from "./unlockerClient";

// Get URL unlockers for the current user
export const getUserUnlockers = async (): Promise<UrlUnlocker[]> => {
  try {
    const userId = await checkAuthentication();
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('url_unlockers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(transformUnlockerData);
  } catch (error) {
    console.error('Error retrieving URL unlockers:', error);
    return [];
  }
};

// Get a URL unlocker by its ID
export const getUnlockerById = async (id: string): Promise<UrlUnlocker | null> => {
  try {
    const { data, error } = await supabase
      .from('url_unlockers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    return transformUnlockerData(data);
  } catch (error) {
    console.error('Error retrieving URL unlocker:', error);
    return null;
  }
};

// Get links that are about to expire (within the next 7 days)
export const getExpiringUnlockers = async (): Promise<UrlUnlocker[]> => {
  try {
    const userId = await checkAuthentication();
    if (!userId) return [];
    
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const { data, error } = await supabase
      .from('url_unlockers')
      .select('*')
      .eq('user_id', userId)
      .lt('expiration_date', sevenDaysFromNow.toISOString())
      .gt('expiration_date', new Date().toISOString())
      .order('expiration_date', { ascending: true });
    
    if (error) throw error;
    
    return (data || []).map(transformUnlockerData);
  } catch (error) {
    console.error('Error retrieving expiring URL unlockers:', error);
    return [];
  }
};
