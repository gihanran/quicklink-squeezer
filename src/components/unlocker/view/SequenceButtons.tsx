
import React from 'react';
import { ButtonColor } from '@/utils/unlocker/types';

interface SequenceButtonsProps {
  onClick: (color: ButtonColor) => void;
  disabled: boolean;
}

const SequenceButtons: React.FC<SequenceButtonsProps> = ({ onClick, disabled }) => {
  const colors: ButtonColor[] = ["red", "blue", "green", "yellow"];
  
  return (
    <div className="flex justify-center space-x-4 mb-4">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-14 h-14 rounded-full ${
            color === "red" ? "bg-red-500" : 
            color === "blue" ? "bg-blue-500" : 
            color === "green" ? "bg-green-500" : 
            "bg-yellow-500"
          } shadow-lg hover:scale-110 transition-transform ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onClick(color)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default SequenceButtons;
