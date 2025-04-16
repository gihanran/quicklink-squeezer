
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

type ButtonStyleType = 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';

interface ButtonStyleSelectorProps {
  buttonStyle: ButtonStyleType;
  onButtonStyleChange: (style: ButtonStyleType) => void;
}

const ButtonStyleSelector: React.FC<ButtonStyleSelectorProps> = ({
  buttonStyle,
  onButtonStyleChange
}) => {
  // Function to safely handle button style changes
  const handleButtonStyleChange = (value: string) => {
    if (value === 'default' || value === 'rounded' || value === 'pill' || value === 'outline' || value === 'subtle') {
      onButtonStyleChange(value as ButtonStyleType);
    }
  };

  return (
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
  );
};

export default ButtonStyleSelector;
