
import { supabase } from "@/integrations/supabase/client";
import { UrlStats } from "./types";

// Track a visit to a short URL
export const trackVisit = async (shortCode: string): Promise<void> => {
  try {
    // Get the URL ID first
    const { data: urlData, error: urlError } = await supabase
      .from('short_urls')
      .select('id')
      .eq('short_code', shortCode)
      .maybeSingle();
    
    if (urlError || !urlData) {
      console.error('Error retrieving URL for visit tracking:', urlError);
      return;
    }
    
    // Get referrer and user agent info
    const referrer = document.referrer || null;
    const userAgent = navigator.userAgent || null;
    
    // Record the visit
    const { error: visitError } = await supabase
      .from('url_visits')
      .insert({
        short_url_id: urlData.id,
        referrer,
        user_agent: userAgent
      });
    
    if (visitError) {
      console.error('Error recording visit:', visitError);
    }
    
    // The increment_url_visits trigger will automatically update the visit count
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
};

// Get stats about total links and clicks
export const getUrlStats = async (): Promise<UrlStats> => {
  try {
    // Count total links (including deleted ones)
    // We'll use the database function to get a count of all links ever created
    const { data: totalLinksData, error: linksError } = await supabase
      .rpc('get_total_links_created');
    
    if (linksError) {
      console.error('Error counting total links:', linksError);
      // Fallback to counting current links
      const { count: currentLinks, error: currentLinksError } = await supabase
        .from('short_urls')
        .select('*', { count: 'exact', head: true });
      
      if (currentLinksError) throw currentLinksError;
      return { totalLinks: currentLinks || 0, totalClicks: 0 };
    }
    
    const totalLinks = totalLinksData && totalLinksData[0] ? Number(totalLinksData[0].count) : 0;
    
    // Get total clicks (including for deleted links)
    const { data: totalClicksData, error: clicksError } = await supabase
      .rpc('get_total_clicks');
    
    if (clicksError) {
      console.error('Error getting total clicks:', clicksError);
      // Fallback to summing clicks from existing links
      const { data: clicksData, error: currentClicksError } = await supabase
        .from('short_urls')
        .select('visits');
      
      if (currentClicksError) throw currentClicksError;
      const totalClicks = clicksData.reduce((sum, url) => sum + (url.visits || 0), 0);
      return { totalLinks, totalClicks };
    }

    const totalClicks = totalClicksData && totalClicksData[0] ? Number(totalClicksData[0].total_clicks) : 0;
    
    // Get remaining link balance if user is logged in
    let remainingLinks;
    let linkLimit;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('link_limit')
        .eq('id', session.user.id)
        .single();
      
      linkLimit = profile?.link_limit || 100;
      
      // Count links created this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count } = await supabase
        .from('short_urls')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', startOfMonth.toISOString());
      
      const linksCreatedThisMonth = count || 0;
      remainingLinks = linkLimit - linksCreatedThisMonth;
    }
    
    return {
      totalLinks,
      totalClicks,
      remainingLinks,
      linkLimit
    };
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return { totalLinks: 0, totalClicks: 0 };
  }
};
