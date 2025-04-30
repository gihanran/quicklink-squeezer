
import React from 'react';
import { ExternalLink, UserPlus } from 'lucide-react';
import type { BioCard, BioCardLink } from '@/types/bioCardTypes';

interface BioCardLinksProps {
  bioCard: BioCard;
  links: BioCardLink[];
  onLinkClick: (linkId: string) => void;
}

export const BioCardLinks: React.FC<BioCardLinksProps> = ({ bioCard, links, onLinkClick }) => {
  // Links are already in the order they were added, maintained by the drag and drop functionality
  return (
    <div className="space-y-3 w-full">
      {links.map((link) => {
        const buttonStyles = {
          backgroundColor: bioCard.button_color || '#6366f1',
          borderRadius: 
            bioCard.button_style === 'rounded' ? '0.375rem' : 
            bioCard.button_style === 'pill' ? '9999px' : 
            '0px'
        };
        
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onLinkClick(link.id)}
            className="block w-full text-center py-2 px-3 text-white shadow hover:opacity-90 transition-opacity text-sm"
            style={buttonStyles}
          >
            <div className="flex items-center justify-center">
              <span>{link.title}</span>
              <ExternalLink className="ml-2 h-3 w-3" />
            </div>
            {link.description && (
              <div className="text-xs mt-1 opacity-90">{link.description}</div>
            )}
          </a>
        );
      })}

      <a
        href="/"
        className="block w-full text-center py-2 px-3 text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mt-6"
      >
        <div className="flex items-center justify-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Create Your Own Bio Card</span>
        </div>
        <div className="text-xs mt-1 text-gray-500">
          Join thousands of creators sharing their links
        </div>
      </a>
    </div>
  );
};
