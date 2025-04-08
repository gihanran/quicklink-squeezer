
import { supabase } from "@/integrations/supabase/client";

// Check if user has remaining link balance
export const checkLinkBalance = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false; // Anonymous users still have restrictions
    
    // Registered users now have unlimited links
    return true;
  } catch (error) {
    console.error('Error checking link balance:', error);
    return false;
  }
};

// Get remaining link balance
export const getRemainingLinkBalance = async (): Promise<number | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    // Return Infinity for registered users since they have unlimited links
    return Infinity;
  } catch (error) {
    console.error('Error getting remaining link balance:', error);
    return null;
  }
};
