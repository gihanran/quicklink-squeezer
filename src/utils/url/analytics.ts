
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
      
      // For total links, use the DB function that returns the total count
      const { data: totalLinks, error: totalLinksError } = await supabase
        .rpc('get_total_links_created');
      
      if (totalLinksError) {
        console.error('Error fetching total links:', totalLinksError);
      } else {
        stats.totalLinks = totalLinks?.[0]?.count || 0;
      }
      
      // For total clicks, use the DB function that returns the total clicks
      const { data: totalClicks, error: totalClicksError } = await supabase
        .rpc('get_total_clicks');
      
      if (totalClicksError) {
        console.error('Error fetching total clicks:', totalClicksError);
      } else {
        stats.totalClicks = totalClicks?.[0]?.total_clicks || 0;
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
