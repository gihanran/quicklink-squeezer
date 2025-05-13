
import { supabase } from "@/integrations/supabase/client";
import { UrlUnlocker } from "./types";
import { checkAuthentication, handleError, transformUnlockerData } from "./unlockerClient";

// Create a new URL unlocker
export const createUrlUnlocker = async (
  destinationUrl: string,
  title: string | undefined,
  sequence: string[]
): Promise<UrlUnlocker | null> => {
  try {
    const userId = await checkAuthentication();
    if (!userId) return null;
    
    // Create expiration date (30 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    const { data, error } = await supabase
      .from('url_unlockers')
      .insert({
        user_id: userId,
        destination_url: destinationUrl,
        title,
        sequence,
        expiration_date: expirationDate.toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return transformUnlockerData(data);
  } catch (error: any) {
    return handleError(error, "Failed to create URL unlocker");
  }
};
