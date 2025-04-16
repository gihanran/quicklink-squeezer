
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BackgroundImageUploaderProps {
  backgroundImageUrl: string | null;
  onBackgroundImageChange: (imageUrl: string | null) => void;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
}

const BackgroundImageUploader: React.FC<BackgroundImageUploaderProps> = ({
  backgroundImageUrl,
  onBackgroundImageChange,
  handleBackgroundImageUpload,
  uploading
}) => {
  const handleRemoveBackground = () => {
    onBackgroundImageChange(null);
  };

  return (
    <div>
      <Label>Background Image</Label>
      <div className="mt-1.5 space-y-3">
        <div className="flex items-center gap-2">
          <Input
            id="background-image"
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            disabled={uploading}
            className="flex-1"
          />
        </div>
        
        {backgroundImageUrl && (
          <div className="relative rounded-md overflow-hidden h-40">
            <img 
              src={backgroundImageUrl} 
              alt="Background Preview" 
              className="w-full h-full object-cover"
            />
            <Button 
              variant="destructive" 
              size="sm"
              className="absolute top-2 right-2 opacity-80 hover:opacity-100"
              onClick={handleRemoveBackground}
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackgroundImageUploader;
