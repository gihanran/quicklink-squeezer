
import { supabase } from "@/integrations/supabase/client";
import { UrlData, UrlStats } from "./types";

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
    
    const { data: links, error } = await supabase
      .from('short_urls')
      .select('visits')
      .eq('user_id', session.user.id);
    
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
    
    const linkLimit = profile?.link_limit || 10; // Default to 10 if not set
    const remainingLinks = linkLimit - totalLinks;
    
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
