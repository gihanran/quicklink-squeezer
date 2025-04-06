
import { supabase } from "@/integrations/supabase/client";
import { UrlData, UrlStats } from "./types";
import { generateShortCode } from "./codeGenerator";
import { checkLinkBalance } from "./linkLimits";

// Create a new shortened URL and store it in the database
export const storeUrl = async (originalUrl: string, title?: string): Promise<UrlData> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // If user is authenticated, check if they've reached their monthly limit
    if (userId) {
      const canCreateLink = await checkLinkBalance();
      if (!canCreateLink) {
        throw new Error("You have reached your monthly link creation limit");
      }
    }
    
    // Generate a unique short code
    const shortCode = generateShortCode();
    
    // Default expiration is 30 days for anonymous users, 90 days for authenticated users
    const expirationDays = userId ? 90 : 30;
    
    // Store the URL in the database
    const urlData = await createShortenedUrl(
      originalUrl,
      shortCode,
      expirationDays,
      userId,
      title
    );
    
    if (!urlData) {
      throw new Error("Failed to create shortened URL");
    }
    
    return urlData;
  } catch (error: any) {
    console.error('Error storing URL:', error);
    throw error;
  }
};

// Create a new shortened URL
export const createShortenedUrl = async (
  originalUrl: string,
  shortCode: string,
  expirationDays?: number,
  userId?: string,
  title?: string
): Promise<UrlData | null> => {
  try {
    // Calculate expiration date if requested
    const expiresAt = expirationDays 
      ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString()
      : null;
    
    const { data, error } = await supabase
      .from('short_urls')
      .insert({
        original_url: originalUrl,
        short_code: shortCode,
        expires_at: expiresAt,
        user_id: userId,
        title: title || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      originalUrl: data.original_url,
      shortCode: data.short_code,
      createdAt: new Date(data.created_at).getTime(),
      expiresAt: expiresAt ? new Date(expiresAt).getTime() : undefined,
      visits: data.visits,
      userId: data.user_id,
      title: data.title
    };
  } catch (error) {
    console.error('Error creating shortened URL:', error);
    return null;
  }
};

// Delete a shortened URL
export const deleteUrl = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('short_urls')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting URL:', error);
    return false;
  }
};

// Get stats about user's URLs
export const getUrlStats = async (): Promise<UrlStats> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return { totalLinks: 0, totalClicks: 0 };
    }
    
    // Get all active links (not expired) for the user
    const now = new Date().toISOString();
    
    const { data: links, error } = await supabase
      .from('short_urls')
      .select('visits')
      .eq('user_id', session.user.id)
      .or(`expires_at.gt.${now},expires_at.is.null`);
    
    if (error) throw error;
    
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + (link.visits || 0), 0);
    
    // Get user's link limit
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('link_limit')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      return { totalLinks, totalClicks };
    }
    
    const linkLimit = profile?.link_limit || 100; // Default to 100 if not set
    
    // Count active links created this month for the link balance
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count: monthlyLinksCount, error: countError } = await supabase
      .from('short_urls')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('created_at', startOfMonth.toISOString());
    
    if (countError) throw countError;
    
    const linksCreatedThisMonth = monthlyLinksCount || 0;
    const remainingLinks = linkLimit - linksCreatedThisMonth;
    
    return { 
      totalLinks, 
      totalClicks,
      linkLimit,
      remainingLinks
    };
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return { totalLinks: 0, totalClicks: 0 };
  }
};
