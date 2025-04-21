
import React from 'react';
import { MousePointerClick } from 'lucide-react';
import type { BioCardLink } from '@/types/bioCardTypes';

interface BioCardLinksSummaryProps {
  links: BioCardLink[];
}

const BioCardLinksSummary: React.FC<BioCardLinksSummaryProps> = ({ links }) => {
  if (!links || links.length === 0) return null;

  return (
    <div className="mt-2 space-y-1 border-t pt-2">
      <div className="text-sm font-medium mb-1">Link Performance:</div>
      {links.map((link) => (
        <div key={link.id} className="text-sm text-gray-600 flex items-center justify-between">
          <span className="truncate flex-1">{link.title}</span>
          <span className="ml-2 flex items-center">
            <MousePointerClick className="h-3 w-3 mr-1" />
            {link.clicks || 0}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BioCardLinksSummary;
