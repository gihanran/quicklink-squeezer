
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ThemeColorPickerProps {
  themeColor: string;
  onThemeColorChange: (color: string) => void;
}

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({
  themeColor,
  onThemeColorChange
}) => {
  return (
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
  );
};

export default ThemeColorPicker;
