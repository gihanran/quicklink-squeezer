
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface BackgroundImageUploadProps {
  backgroundImageUrl: string;
  backgroundOverlay: number;
  uploading: boolean;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setBackgroundOverlay: (value: number) => void;
}

const BackgroundImageUpload: React.FC<BackgroundImageUploadProps> = ({
  backgroundImageUrl,
  backgroundOverlay,
  uploading,
  handleBackgroundImageUpload,
  setBackgroundOverlay,
}) => {
  return (
    <div className="space-y-2">
      <Label>Background Image</Label>
      <div className="mt-2">
        {backgroundImageUrl ? (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img
              src={backgroundImageUrl}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
              <div className="relative">
                <Button size="icon" className="bg-primary hover:bg-primary/90">
                  <Upload className="h-4 w-4 text-white" />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Button variant="outline" className="w-full h-48 border-dashed">
              <Upload className="h-6 w-6 mr-2" />
              Upload Background Image
            </Button>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>

      {backgroundImageUrl && (
        <div className="space-y-2 mt-4">
          <Label>Background Overlay Opacity</Label>
          <Slider
            value={[backgroundOverlay]}
            onValueChange={([value]) => setBackgroundOverlay(value)}
            max={1}
            step={0.1}
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
};

export default BackgroundImageUpload;
