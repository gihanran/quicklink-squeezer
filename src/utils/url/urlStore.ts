
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
