
import React from 'react';
import { Label } from '@/components/ui/label';
import { HexColorPicker } from 'react-colorful';
import { getContrastColor } from '@/utils/colorUtils';

interface StyleSettingsProps {
  bgColor: string;
  setBgColor: (color: string) => void;
  buttonColor: string;
  setButtonColor: (color: string) => void;
  buttonStyle: string;
  setButtonStyle: (style: string) => void;
  colorPickerOpen: string | null;
  setColorPickerOpen: (value: string | null) => void;
}

export const StyleSettings = ({
  bgColor,
  setBgColor,
  buttonColor,
  setButtonColor,
  buttonStyle,
  setButtonStyle,
  colorPickerOpen,
  setColorPickerOpen
}: StyleSettingsProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Style Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Background Color</Label>
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => setColorPickerOpen(colorPickerOpen === 'bg' ? null : 'bg')}
              className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer"
              style={{ backgroundColor: bgColor }}
            >
              <span style={{ color: getContrastColor(bgColor) }}>{bgColor}</span>
              <div
                className="h-6 w-6 rounded border border-gray-300"
                style={{ backgroundColor: bgColor }}
              />
            </button>
            {colorPickerOpen === 'bg' && (
              <div className="absolute z-10 mt-2">
                <HexColorPicker color={bgColor} onChange={setBgColor} />
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Label>Button Color</Label>
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => setColorPickerOpen(colorPickerOpen === 'button' ? null : 'button')}
              className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer"
              style={{ backgroundColor: buttonColor }}
            >
              <span style={{ color: getContrastColor(buttonColor) }}>{buttonColor}</span>
              <div
                className="h-6 w-6 rounded border border-gray-300"
                style={{ backgroundColor: buttonColor }}
              />
            </button>
            {colorPickerOpen === 'button' && (
              <div className="absolute z-10 mt-2">
                <HexColorPicker color={buttonColor} onChange={setButtonColor} />
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-2">
          <Label>Button Style</Label>
          <div className="grid grid-cols-3 gap-3 mt-1">
            {['rounded', 'pill', 'square'].map(style => (
              <button
                key={style}
                type="button"
                onClick={() => setButtonStyle(style)}
                className={`h-10 border ${
                  buttonStyle === style
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-300'
                } flex items-center justify-center text-sm capitalize transition-all`}
                style={{
                  backgroundColor: buttonColor,
                  color: getContrastColor(buttonColor),
                  borderRadius: 
                    style === 'rounded' ? '0.375rem' : 
                    style === 'pill' ? '9999px' : 
                    '0px'
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
