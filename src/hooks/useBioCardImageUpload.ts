
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/auth';

export const useBioCardImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthState();

  const uploadImage = async (file: File, type: 'profile' | 'background'): Promise<string | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to upload images',
        variant: 'destructive',
      });
      return null;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/bio_cards/${type}_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('bio_cards')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from('bio_cards')
        .getPublicUrl(fileName);

      toast({
        title: 'Image uploaded',
        description: `Your ${type} image has been uploaded successfully`,
      });

      return data.publicUrl;
    } catch (error: any) {
      console.error(`Error uploading ${type} image:`, error);
      toast({
        title: 'Upload failed',
        description: error.message || `An error occurred while uploading the ${type} image`,
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImage,
    uploading
  };
};
