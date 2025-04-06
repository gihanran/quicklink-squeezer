
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
    
    // If user is logged in, fetch user-specific stats
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
      
      // Get user link limit from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('link_limit')
        .eq('id', session.user.id)
        .single();
      
      if (!profileError && profile) {
        const linkLimit = profile.link_limit || 100; // Default to 100 if not set
        stats.linkLimit = linkLimit;
        
        // Calculate remaining links - only count active, non-expired links
        const { count, error: countError } = await supabase
          .from('short_urls')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .or(`expires_at.gt.${now},expires_at.is.null`);
        
        if (!countError) {
          stats.remainingLinks = linkLimit - (count || 0);
        }
      }
    } else {
      // For public facing stats (total links and clicks across the platform)
      
      // Get total count of short_codes (total links created)
      const { count, error: countError } = await supabase
        .from('short_urls')
        .select('short_code', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error fetching total links:', countError);
      } else {
        stats.totalLinks = count || 0;
      }
      
      // Sum all visits (total clicks)
      const { data: clicksData, error: clicksError } = await supabase
        .from('short_urls')
        .select('visits');
      
      if (clicksError) {
        console.error('Error fetching total clicks:', clicksError);
      } else {
        stats.totalClicks = clicksData.reduce((sum, link) => sum + (link.visits || 0), 0);
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return {
      totalLinks: 0,
      totalClicks: 0,
      remainingLinks: undefined,
      linkLimit: undefined
    };
  }
};
