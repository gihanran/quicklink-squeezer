
import { supabase } from "@/integrations/supabase/client";

export const getUrlStats = async () => {
  try {
    // Get session for the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    // Initialize the default stats
    const stats = {
      totalLinks: 0,
      totalClicks: 0,
      remainingLinks: undefined,
      linkLimit: undefined
    };
    
    // If user is logged in, fetch user-specific stats for the dashboard
    if (session?.user) {
      const now = new Date().toISOString();
      
      // Fetch total links for the user (all links ever created)
      const { data: userLinks, error: userLinksError } = await supabase
        .from('short_urls')
        .select('id, visits')
        .eq('user_id', session.user.id);
      
      if (userLinksError) throw userLinksError;
      
      // Compute user stats
      stats.totalLinks = userLinks?.length || 0;
      stats.totalClicks = userLinks?.reduce((sum, link) => sum + (link.visits || 0), 0) || 0;
      
      // Get user link limit from profile - this is now unlimited for registered users
      stats.linkLimit = Infinity; // Set to Infinity for unlimited
      stats.remainingLinks = Infinity; // Set to Infinity for unlimited
    }
    
    // Get total platform stats (ALL users) - this runs for BOTH logged in and anonymous users
    // Count total links created across all users
    const { count: totalLinksCount, error: totalLinksError } = await supabase
      .from('short_urls')
      .select('id', { count: 'exact', head: true });
    
    if (!totalLinksError) {
      stats.totalLinks = totalLinksCount || 0;
    }
    
    // Sum all visits (total clicks) across all links
    const { data: allClicksData, error: allClicksError } = await supabase
      .from('short_urls')
      .select('visits');
    
    if (!allClicksError) {
      stats.totalClicks = allClicksData.reduce((sum, link) => sum + (link.visits || 0), 0);
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return {
      totalLinks: 0,
      totalClicks: 0,
      remainingLinks: Infinity, // Set to Infinity for unlimited
      linkLimit: Infinity // Set to Infinity for unlimited
    };
  }
};
