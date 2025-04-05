
import { supabase } from "@/integrations/supabase/client";

// Get URL with all tracking info for analytics
export const getUrlWithAnalytics = async (shortCode: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('short_urls')
      .select('*, url_visits(*)')
      .eq('short_code', shortCode)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Process tracking data
    let devices = { desktop: 0, mobile: 0, tablet: 0 };
    let locations = {};
    let browsers = { chrome: 0, firefox: 0, safari: 0, other: 0 };
    
    // This is sample data until we implement proper tracking
    if (data.visits > 0) {
      // Generate sample tracking data based on real visit count
      const totalVisits = data.visits;
      
      // Device distribution (60% desktop, 35% mobile, 5% tablet)
      devices = {
        desktop: Math.round(totalVisits * 0.6),
        mobile: Math.round(totalVisits * 0.35),
        tablet: Math.round(totalVisits * 0.05)
      };
      
      // Browser distribution
      browsers = {
        chrome: Math.round(totalVisits * 0.5),
        firefox: Math.round(totalVisits * 0.2),
        safari: Math.round(totalVisits * 0.2),
        other: Math.round(totalVisits * 0.1)
      };
      
      // Sample locations (for demonstration)
      const topCountries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'Japan', 'India'];
      locations = topCountries.reduce((acc, country, index) => {
        // Distribute visits with decreasing probability
        const weight = 1 / (index + 1);
        const countryVisits = Math.round(totalVisits * weight * 0.3);
        if (countryVisits > 0) {
          acc[country] = countryVisits;
        }
        return acc;
      }, {});
    }
    
    return {
      id: data.id,
      originalUrl: data.original_url,
      shortCode: data.short_code,
      createdAt: new Date(data.created_at).getTime(),
      expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : undefined,
      visits: data.visits,
      userId: data.user_id,
      title: data.title,
      devices,
      locations,
      browsers
    };
  } catch (error) {
    console.error('Error retrieving URL with analytics:', error);
    return null;
  }
};
