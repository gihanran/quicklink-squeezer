
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UrlData } from "./types";
import { generateShortCode } from "./codeGenerator";
import { checkLinkBalance } from "./linkLimits";

// Store a URL in Supabase
export const storeUrl = async (originalUrl: string, title?: string): Promise<UrlData> => {
  try {
    // Check if URL already exists
    const { data: existingUrls, error: existingError } = await supabase
      .from('short_urls')
      .select('*')
      .eq('original_url', originalUrl)
      .limit(1);
    
    if (existingError) throw existingError;
    
    if (existingUrls && existingUrls.length > 0) {
      // Return existing URL data
      const existingUrl = existingUrls[0];
      return {
        id: existingUrl.id,
        originalUrl: existingUrl.original_url,
        shortCode: existingUrl.short_code,
        createdAt: new Date(existingUrl.created_at).getTime(),
        expiresAt: existingUrl.expires_at ? new Date(existingUrl.expires_at).getTime() : undefined,
        visits: existingUrl.visits,
        userId: existingUrl.user_id,
        title: existingUrl.title
      };
    }
    
    // Get current user (if logged in)
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;
    
    // If user is logged in, check link balance
    if (userId) {
      const hasBalance = await checkLinkBalance();
      if (!hasBalance) {
        throw new Error('Monthly link limit reached');
      }
    }
    
    // If not, create a new short URL
    const shortCode = generateShortCode();
    const now = new Date();
    const threeMonthsInMs = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    const expiresAt = new Date(now.getTime() + threeMonthsInMs);
    
    // Set the title to the URL if not provided
    const linkTitle = title || originalUrl;
    
    // Insert new URL
    const { data, error } = await supabase
      .from('short_urls')
      .insert({
        short_code: shortCode,
        original_url: originalUrl,
        expires_at: expiresAt.toISOString(),
        user_id: userId,
        title: linkTitle
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (!data) throw new Error('No data returned from insert');
    
    return {
      id: data.id,
      originalUrl: data.original_url,
      shortCode: data.short_code,
      createdAt: new Date(data.created_at).getTime(),
      expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : undefined,
      visits: data.visits,
      userId: data.user_id,
      title: data.title
    };
  } catch (error: any) {
    console.error('Error storing URL:', error);
    if (error.message === 'Monthly link limit reached') {
      throw new Error('You have reached your monthly link creation limit');
    }
    throw new Error('Failed to shorten URL');
  }
};

// Get a URL by its short code
export const getUrlByShortCode = async (shortCode: string): Promise<UrlData | null> => {
  try {
    const { data, error } = await supabase
      .from('short_urls')
      .select('*')
      .eq('short_code', shortCode)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;
    
    // Check if the URL has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      // URL has expired
      return null;
    }
    
    return {
      id: data.id,
      originalUrl: data.original_url,
      shortCode: data.short_code,
      createdAt: new Date(data.created_at).getTime(),
      expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : undefined,
      visits: data.visits,
      userId: data.user_id,
      title: data.title
    };
  } catch (error) {
    console.error('Error retrieving URL:', error);
    return null;
  }
};

// Get user's URLs (requires authentication)
export const getUserUrls = async (): Promise<UrlData[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('short_urls')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(url => ({
      id: url.id,
      originalUrl: url.original_url,
      shortCode: url.short_code,
      createdAt: new Date(url.created_at).getTime(),
      expiresAt: url.expires_at ? new Date(url.expires_at).getTime() : undefined,
      visits: url.visits,
      userId: url.user_id,
      title: url.title
    }));
  } catch (error) {
    console.error('Error fetching user URLs:', error);
    toast({
      title: "Failed to fetch your URLs",
      description: "Please try again later",
      variant: "destructive"
    });
    return [];
  }
};

// Track visit to a shortened URL
export const trackVisit = async (shortCode: string): Promise<boolean> => {
  try {
    // First, get the current URL data
    const { data, error } = await supabase
      .from('short_urls')
      .select('visits')
      .eq('short_code', shortCode)
      .single();
    
    if (error) throw error;
    
    // Increment the visit counter
    const visits = (data?.visits || 0) + 1;
    
    // Update the URL with the new visit count
    const { error: updateError } = await supabase
      .from('short_urls')
      .update({ visits })
      .eq('short_code', shortCode);
    
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error tracking URL visit:', error);
    return false;
  }
};

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
