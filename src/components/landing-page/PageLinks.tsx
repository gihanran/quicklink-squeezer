
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { LandingPageLink } from '@/types/landingPage';
import { incrementLinkClicks } from '@/services/landingPageLinkService';

interface PageLinksProps {
  links: LandingPageLink[];
}

const PageLinks: React.FC<PageLinksProps> = ({ links }) => {
  const handleLinkClick = async (link: LandingPageLink) => {
    try {
      await incrementLinkClicks(link.id);
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  };

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <a 
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          onClick={() => handleLinkClick(link)}
        >
          <Button
            variant="outline"
            className="w-full py-6 flex items-center justify-between hover:bg-gray-50 transition-all"
          >
            <span className="text-lg font-medium">{link.title}</span>
            <ExternalLink className="h-4 w-4 opacity-50" />
          </Button>
        </a>
      ))}
    </div>
  );
};

export default PageLinks;
