
import { supabase } from "@/integrations/supabase/client";
import { UrlData } from "./types";

// Update URL data
export const updateUrlData = async (id: string, updates: Partial<UrlData>): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (updates.title !== undefined) {
      updateData.title = updates.title;
    }
    
    const { error } = await supabase
      .from('short_urls')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating URL:', error);
    return false;
  }
};
