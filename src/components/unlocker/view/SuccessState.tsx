
import React from 'react';
import { Check, ExternalLink } from 'lucide-react';

interface SuccessStateProps {
  destinationUrl: string;
}

const SuccessState: React.FC<SuccessStateProps> = ({ destinationUrl }) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="bg-green-100 rounded-full p-3">
          <Check className="h-12 w-12 text-green-500" />
        </div>
      </div>
      
      <a 
        href={destinationUrl}
        target="_blank"
        rel="noopener noreferrer" 
        className="inline-block px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
      >
        <div className="flex items-center">
          <span>Visit Unlocked Content</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </div>
      </a>
    </div>
  );
};

export default SuccessState;
