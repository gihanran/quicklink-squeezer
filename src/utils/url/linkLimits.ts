
import { supabase } from "@/integrations/supabase/client";

// Check if user has remaining link balance
export const checkLinkBalance = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    
    // Get user's current link limit and usage for this month
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('link_limit')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) throw profileError;
    
    const linkLimit = profile?.link_limit || 100;
    
    // Count links created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count, error: countError } = await supabase
      .from('short_urls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('created_at', startOfMonth.toISOString());
    
    if (countError) throw countError;
    
    const linksCreatedThisMonth = count || 0;
    
    return linksCreatedThisMonth < linkLimit;
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
    
    // Get user's current link limit
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('link_limit')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) throw profileError;
    
    const linkLimit = profile?.link_limit || 100;
    
    // Count links created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count, error: countError } = await supabase
      .from('short_urls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('created_at', startOfMonth.toISOString());
    
    if (countError) throw countError;
    
    const linksCreatedThisMonth = count || 0;
    
    return linkLimit - linksCreatedThisMonth;
  } catch (error) {
    console.error('Error getting remaining link balance:', error);
    return null;
  }
};
