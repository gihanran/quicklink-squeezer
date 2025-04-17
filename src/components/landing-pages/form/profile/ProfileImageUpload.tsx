
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileImageUploadProps {
  title: string;
  profileImageUrl: string;
  uploading: boolean;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  title,
  profileImageUrl,
  uploading,
  handleProfileImageUpload
}) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-gray-200">
          <AvatarImage src={profileImageUrl || ""} alt="Profile" />
          <AvatarFallback>
            {title ? title.charAt(0).toUpperCase() : "LP"}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-2 -right-2">
          <div className="relative">
            <Button
              type="button"
              size="icon"
              className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
              disabled={uploading}
            >
              <Upload className="h-4 w-4 text-white" />
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
