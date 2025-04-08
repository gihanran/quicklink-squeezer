
import { supabase } from "@/integrations/supabase/client";
import { UrlData, UrlStats } from "./types";
import { generateShortCode } from "./codeGenerator";

// Create a new shortened URL and store it in the database
export const storeUrl = async (originalUrl: string, title?: string): Promise<UrlData> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    // If user is authenticated, they have unlimited links (no limit check needed)
    // Only anonymous users have restrictions
    
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
    
    const now = new Date().toISOString();
    
    // Get all links for the user (for counting total links created)
    const { data: allLinks, error: allLinksError } = await supabase
      .from('short_urls')
      .select('visits')
      .eq('user_id', session.user.id);
    
    if (allLinksError) throw allLinksError;
    
    const totalLinks = allLinks.length; // Total links ever created
    const totalClicks = allLinks.reduce((sum, link) => sum + (link.visits || 0), 0);
    
    // For registered users, there is no link limit
    return { 
      totalLinks, 
      totalClicks,
      linkLimit: Infinity,
      remainingLinks: Infinity
    };
  } catch (error) {
    console.error('Error getting URL stats:', error);
    return { totalLinks: 0, totalClicks: 0 };
  }
};
