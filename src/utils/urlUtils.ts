
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Generate a random short code
export const generateShortCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Interface for our URL data
export interface UrlData {
  id?: string;
  originalUrl: string;
  shortCode: string;
  createdAt: number;
  expiresAt?: number;
  visits: number;
  userId?: string | null;
}

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

// Store a URL in Supabase
export const storeUrl = async (originalUrl: string): Promise<UrlData> => {
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
        userId: existingUrl.user_id
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
    
    // Insert new URL
    const { data, error } = await supabase
      .from('short_urls')
      .insert({
        short_code: shortCode,
        original_url: originalUrl,
        expires_at: expiresAt.toISOString(),
        user_id: userId
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
      userId: data.user_id
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
      userId: data.user_id
    };
  } catch (error) {
    console.error('Error retrieving URL:', error);
    return null;
  }
};

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

// Get the complete shortened URL
export const getFullShortenedUrl = (shortCode: string): string => {
  return `${window.location.origin}/s/${shortCode}`;
};

// Get stats about total links and clicks
export const getUrlStats = async (): Promise<{ totalLinks: number, totalClicks: number, remainingLinks?: number, linkLimit?: number }> => {
  try {
    // Count total valid links (not expired)
    const { count: totalLinks, error: linksError } = await supabase
      .from('short_urls')
      .select('*', { count: 'exact', head: true })
      .gte('expires_at', new Date().toISOString());
    
    if (linksError) throw linksError;
    
    // Sum total clicks
    const { data: clicksData, error: clicksError } = await supabase
      .from('short_urls')
      .select('visits');
    
    if (clicksError) throw clicksError;
    
    const totalClicks = clicksData.reduce((sum, url) => sum + (url.visits || 0), 0);
    
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
      totalLinks: totalLinks || 0,
      totalClicks,
      remainingLinks,
      linkLimit
    };
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return { totalLinks: 0, totalClicks: 0 };
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
      userId: url.user_id
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
