
import React from 'react';
import type { BioCard } from '@/types/bioCardTypes';

interface BioCardProfileHeaderProps {
  bioCard: BioCard;
}

export const BioCardProfileHeader: React.FC<BioCardProfileHeaderProps> = ({ bioCard }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {bioCard.profile_image_url ? (
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white shadow-lg">
          <img 
            src={bioCard.profile_image_url} 
            alt={bioCard.title} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-gray-400">
            {bioCard.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      
      <h1 className="text-2xl font-bold text-center">{bioCard.title}</h1>
      
      {bioCard.description && (
        <p className="text-center mt-2 max-w-sm">
          {bioCard.description}
        </p>
      )}
    </div>
  );
};
