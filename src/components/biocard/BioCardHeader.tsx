
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface BioCardHeaderProps {
  handleCreateNewCard: () => void;
  remainingCards: number;
}

const BioCardHeader: React.FC<BioCardHeaderProps> = ({ 
  handleCreateNewCard, 
  remainingCards 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Bio Cards</h1>
        <p className="text-gray-600">
          Create and manage your bio cards - you have {remainingCards} cards remaining
        </p>
      </div>
      
      <Button
        onClick={handleCreateNewCard}
        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90 flex items-center gap-2"
        disabled={remainingCards <= 0}
      >
        <PlusCircle size={18} />
        Create New Bio Card
      </Button>
    </div>
  );
};

export default BioCardHeader;
