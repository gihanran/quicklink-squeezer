
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface MagicButtonHeaderProps {
  handleCreateNewButton: () => void;
  buttonCount: number;
}

const MagicButtonHeader: React.FC<MagicButtonHeaderProps> = ({ 
  handleCreateNewButton,
  buttonCount
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Magic Buttons</h1>
        <p className="text-gray-600">
          Create interactive buttons that appear on any webpage
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {buttonCount}/25 buttons created
        </p>
      </div>
      <Button 
        onClick={handleCreateNewButton}
        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
        disabled={buttonCount >= 25}
      >
        <Wand2 className="mr-2 h-5 w-5" />
        Create Magic Button
      </Button>
    </div>
  );
};

export default MagicButtonHeader;
