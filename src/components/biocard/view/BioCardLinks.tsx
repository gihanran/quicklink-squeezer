
import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { BioCard, BioCardLink } from '@/types/bioCardTypes';

interface BioCardLinksProps {
  bioCard: BioCard;
  links: BioCardLink[];
  onLinkClick: (linkId: string) => void;
}

export const BioCardLinks: React.FC<BioCardLinksProps> = ({ bioCard, links, onLinkClick }) => {
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
    </div>
  );
};
