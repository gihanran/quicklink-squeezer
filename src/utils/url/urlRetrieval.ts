
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UrlData } from "./types";

// Get a URL by its short code
export const getUrlByShortCode = async (shortCode: string): Promise<UrlData | null> => {
  try {
    console.log(`Retrieving URL for short code: ${shortCode}`);
    
    const { data, error } = await supabase
      .from('short_urls')
      .select('*')
      .eq('short_code', shortCode)
      .maybeSingle();
    
    if (error) {
      console.error('Error retrieving URL:', error);
      throw error;
    }
    
    if (!data) {
      console.log(`No URL found for short code: ${shortCode}`);
      return null;
    }
    
    // Check if the URL has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      console.log(`URL with short code ${shortCode} has expired`);
      return null;
    }
    
    console.log(`Successfully retrieved URL for short code ${shortCode}:`, data.original_url);
    
    return {
      id: data.id,
      originalUrl: data.original_url,
      shortCode: data.short_code,
      createdAt: new Date(data.created_at).getTime(),
      expiresAt: data.expires_at ? new Date(data.expires_at).getTime() : undefined,
      visits: data.visits,
      userId: data.user_id,
      title: data.title,
      description: data.description
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
      title: url.title,
      description: url.description
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
