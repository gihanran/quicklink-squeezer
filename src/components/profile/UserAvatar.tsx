
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  user?: User | null;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onAvatarChange?: (url: string) => void;
}

export const UserAvatar = ({ 
  firstName, 
  lastName, 
  imageUrl,
  user,
  size = "lg",
  editable = false,
  onAvatarChange
}: UserAvatarProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const getInitials = (first: string, last: string) => {
    const firstInitial = first ? first.charAt(0).toUpperCase() : '';
    const lastInitial = last ? last.charAt(0).toUpperCase() : '';
    return (firstInitial + lastInitial) || 'U';
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !user) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;
      const filePath = `${fileName}`;

      setUploading(true);

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user's profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      if (onAvatarChange) {
        onAvatarChange(data.publicUrl);
      }

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully."
      });

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your profile picture.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-offset-2 ring-offset-background`}>
        <AvatarImage src={imageUrl || ""} alt={`${firstName} ${lastName}`} />
        <AvatarFallback className="bg-brand-purple text-white text-xl">
          {getInitials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>

      {editable && user && (
        <div className="absolute -bottom-2 -right-2">
          <div className="relative">
            <Button
              type="button"
              size="icon"
              className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Camera className="h-4 w-4 text-white" />
              )}
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>
        </div>
      )}
    </div>
  );
};
