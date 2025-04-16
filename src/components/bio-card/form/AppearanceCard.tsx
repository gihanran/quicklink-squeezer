
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ButtonStyleType = 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';

interface AppearanceCardProps {
  backgroundImageUrl: string | null;
  themeColor: string;
  buttonStyle: ButtonStyleType;
  onBackgroundImageChange: (imageUrl: string | null) => void;
  onThemeColorChange: (color: string) => void;
  onButtonStyleChange: (style: ButtonStyleType) => void;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
}

export const AppearanceCard: React.FC<AppearanceCardProps> = ({
  backgroundImageUrl,
  themeColor,
  buttonStyle,
  onBackgroundImageChange,
  onThemeColorChange,
  onButtonStyleChange,
  handleBackgroundImageUpload,
  uploading
}) => {
  const { toast } = useToast();

  const handleRemoveBackground = () => {
    onBackgroundImageChange(null);
    toast({
      title: "Background removed",
      description: "Background image has been removed"
    });
  };

  // Function to safely handle button style changes
  const handleButtonStyleChange = (value: string) => {
    if (value === 'default' || value === 'rounded' || value === 'pill' || value === 'outline' || value === 'subtle') {
      onButtonStyleChange(value as ButtonStyleType);
    }
  };

  console.log("Current button style:", buttonStyle); // Debug log to check current button style

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="theme-color">Theme Color</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              id="theme-color"
              type="color"
              value={themeColor}
              onChange={(e) => onThemeColorChange(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <div className="flex-1">
              <Input
                value={themeColor}
                onChange={(e) => onThemeColorChange(e.target.value)}
                className="uppercase"
              />
            </div>
          </div>
        </div>

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

        <div>
          <Label>Button Style</Label>
          <RadioGroup 
            value={buttonStyle} 
            onValueChange={handleButtonStyleChange}
            className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="border rounded-md p-3 flex items-center justify-center w-full">
                <Button variant="default" size="sm" className="w-full">Default</Button>
              </div>
              <RadioGroupItem value="default" id="default" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="border rounded-md p-3 flex items-center justify-center w-full">
                <Button variant="default" size="sm" className="w-full rounded-lg">Rounded</Button>
              </div>
              <RadioGroupItem value="rounded" id="rounded" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="border rounded-md p-3 flex items-center justify-center w-full">
                <Button variant="default" size="sm" className="w-full rounded-full">Pill</Button>
              </div>
              <RadioGroupItem value="pill" id="pill" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="border rounded-md p-3 flex items-center justify-center w-full">
                <Button variant="outline" size="sm" className="w-full">Outline</Button>
              </div>
              <RadioGroupItem value="outline" id="outline" />
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="border rounded-md p-3 flex items-center justify-center w-full">
                <Button variant="ghost" size="sm" className="w-full">Subtle</Button>
              </div>
              <RadioGroupItem value="subtle" id="subtle" />
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceCard;
