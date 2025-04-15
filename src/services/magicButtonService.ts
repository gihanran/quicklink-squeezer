
import { supabase } from "@/integrations/supabase/client";
import { MagicButton, CreateMagicButtonData } from "@/types/magicButton";
import { toast } from "@/hooks/use-toast";

export const getMagicButtons = async (): Promise<MagicButton[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('magic_buttons')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching magic buttons:', error);
    toast({
      title: "Failed to fetch magic buttons",
      description: "Please try again later",
      variant: "destructive"
    });
    return [];
  }
};

export const createMagicButton = async (buttonData: CreateMagicButtonData): Promise<MagicButton | null> => {
  try {
    // First check if user has reached their limit
    const { count } = await getUserMagicButtonCount(buttonData.user_id);
    
    if (count >= 25) {
      toast({
        title: "Magic Button limit reached",
        description: "You can create a maximum of 25 magic buttons",
        variant: "destructive"
      });
      return null;
    }
    
    const { data, error } = await supabase
      .from('magic_buttons')
      .insert(buttonData)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Magic Button created successfully",
      description: "Your magic button is ready to share",
    });
    
    return data;
  } catch (error) {
    console.error('Error creating magic button:', error);
    toast({
      title: "Failed to create magic button",
      description: "Please try again later",
      variant: "destructive"
    });
    return null;
  }
};

export const updateMagicButton = async (id: string, updates: Partial<MagicButton>): Promise<MagicButton | null> => {
  try {
    const { data, error } = await supabase
      .from('magic_buttons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Magic Button updated successfully",
    });
    
    return data;
  } catch (error) {
    console.error('Error updating magic button:', error);
    toast({
      title: "Failed to update magic button",
      description: "Please try again later",
      variant: "destructive"
    });
    return null;
  }
};

export const deleteMagicButton = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('magic_buttons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Magic Button deleted successfully",
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting magic button:', error);
    toast({
      title: "Failed to delete magic button",
      description: "Please try again later",
      variant: "destructive"
    });
    return false;
  }
};

export const incrementMagicButtonClicks = async (id: string): Promise<boolean> => {
  try {
    // Log the button ID to help with debugging
    console.log(`Incrementing clicks for magic button ID: ${id}`);
    
    // First get the current click count
    const { data, error } = await supabase
      .from('magic_buttons')
      .select('clicks')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error getting click count:', error);
      throw error;
    }
    
    if (!data) {
      console.error('Magic button not found with ID:', id);
      return false;
    }
    
    const newClickCount = (data.clicks || 0) + 1;
    console.log(`Updating clicks from ${data.clicks} to ${newClickCount}`);
    
    // Update the click count
    const { error: updateError } = await supabase
      .from('magic_buttons')
      .update({ clicks: newClickCount })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating click count:', updateError);
      throw updateError;
    }
    
    console.log('Successfully updated click count');
    return true;
  } catch (error) {
    console.error('Error incrementing magic button clicks:', error);
    return false;
  }
};

export const getUserMagicButtonCount = async (userId: string): Promise<{ count: number }> => {
  try {
    const { count, error } = await supabase
      .from('magic_buttons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return { count: count || 0 };
  } catch (error) {
    console.error('Error getting user magic button count:', error);
    return { count: 0 };
  }
};
