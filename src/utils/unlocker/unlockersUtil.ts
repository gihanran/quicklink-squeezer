
import { supabase } from "@/integrations/supabase/client";
import { UrlUnlocker } from "./types";
import { toast } from "@/hooks/use-toast";

// Create a new URL unlocker
export const createUrlUnlocker = async (
  destinationUrl: string,
  title: string | undefined,
  sequence: string[]
): Promise<UrlUnlocker | null> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create URL unlockers",
        variant: "destructive"
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('url_unlockers')
      .insert({
        user_id: session.user.id,
        destination_url: destinationUrl,
        title,
        sequence
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating URL unlocker:', error);
      throw error;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      sequence: data.sequence,
      destinationUrl: data.destination_url,
      title: data.title,
      clicks: data.clicks,
      unlocks: data.unlocks,
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
    };
  } catch (error: any) {
    console.error('Error creating URL unlocker:', error);
    toast({
      title: "Failed to create URL unlocker",
      description: error.message || "Please try again",
      variant: "destructive"
    });
    return null;
  }
};

// Get URL unlockers for the current user
export const getUserUnlockers = async (): Promise<UrlUnlocker[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('url_unlockers')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error retrieving URL unlockers:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      id: item.id,
      userId: item.user_id,
      sequence: item.sequence,
      destinationUrl: item.destination_url,
      title: item.title,
      clicks: item.clicks,
      unlocks: item.unlocks,
      createdAt: new Date(item.created_at).getTime(),
      updatedAt: new Date(item.updated_at).getTime(),
    }));
  } catch (error) {
    console.error('Error retrieving URL unlockers:', error);
    toast({
      title: "Failed to retrieve your unlockers",
      description: "Please try again later",
      variant: "destructive"
    });
    return [];
  }
};

// Get a URL unlocker by its ID
export const getUnlockerById = async (id: string): Promise<UrlUnlocker | null> => {
  try {
    const { data, error } = await supabase
      .from('url_unlockers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error retrieving URL unlocker:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      sequence: data.sequence,
      destinationUrl: data.destination_url,
      title: data.title,
      clicks: data.clicks,
      unlocks: data.unlocks,
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
    };
  } catch (error) {
    console.error('Error retrieving URL unlocker:', error);
    return null;
  }
};

// Track a click on a URL unlocker
export const trackUnlockerClick = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('url_unlockers')
      .update({ clicks: supabase.rpc('increment', { row_id: id, table_name: 'url_unlockers', column_name: 'clicks' }) })
      .eq('id', id);
    
    if (error) {
      console.error('Error tracking unlocker click:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking unlocker click:', error);
    return false;
  }
};

// Track a successful unlock
export const trackUnlockerSuccess = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('url_unlockers')
      .update({ unlocks: supabase.rpc('increment', { row_id: id, table_name: 'url_unlockers', column_name: 'unlocks' }) })
      .eq('id', id);
    
    if (error) {
      console.error('Error tracking unlocker success:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error tracking unlocker success:', error);
    return false;
  }
};

// Delete a URL unlocker
export const deleteUnlocker = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('url_unlockers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting URL unlocker:', error);
    return false;
  }
};
