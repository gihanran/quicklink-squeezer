
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ThemeColorPicker from './appearance/ThemeColorPicker';
import BackgroundImageUploader from './appearance/BackgroundImageUploader';
import ButtonStyleSelector from './appearance/ButtonStyleSelector';

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

  console.log("Current button style:", buttonStyle); // Debug log to check current button style

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeColorPicker 
          themeColor={themeColor}
          onThemeColorChange={onThemeColorChange}
        />

        <BackgroundImageUploader 
          backgroundImageUrl={backgroundImageUrl}
          onBackgroundImageChange={onBackgroundImageChange}
          handleBackgroundImageUpload={handleBackgroundImageUpload}
          uploading={uploading}
        />

        <ButtonStyleSelector 
          buttonStyle={buttonStyle}
          onButtonStyleChange={onButtonStyleChange}
        />
      </CardContent>
    </Card>
  );
};

export default AppearanceCard;
