
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfileImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return null;
    
    try {
      setUploading(true);
      setError(null);
      
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to upload an image",
          variant: "destructive"
        });
        throw new Error('You must be logged in to upload an image');
      }
      
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/landing-pages/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('landing_pages')
        .upload(fileName, file, { upsert: true });
        
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive"
        });
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('landing_pages')
        .getPublicUrl(fileName);
        
      toast({
        title: "Image uploaded",
        description: "Your profile image has been uploaded successfully",
      });

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the image",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    error,
    uploadProfileImage
  };
};
