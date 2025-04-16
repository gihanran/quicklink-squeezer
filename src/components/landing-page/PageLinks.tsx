
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { LandingPageLink } from '@/types/landingPage';
import { incrementLinkClicks } from '@/services/landingPageLinkService';

interface PageLinksProps {
  links: LandingPageLink[];
  buttonStyle?: 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';
  themeColor: string;
  hasBackgroundImage: boolean;
}

const PageLinks: React.FC<PageLinksProps> = ({ 
  links, 
  buttonStyle = 'default',
  themeColor,
  hasBackgroundImage
}) => {
  const getButtonClasses = (style: string = 'default') => {
    const baseClasses = "w-full py-6 flex items-center justify-between hover:bg-gray-50 border-2 transition-all";
    
    switch (style) {
      case 'rounded':
        return `${baseClasses} rounded-lg`;
      case 'pill':
        return `${baseClasses} rounded-full`;
      case 'outline':
        return `${baseClasses} bg-transparent`;
      case 'subtle':
        return `${baseClasses} bg-transparent border-opacity-30`;
      default:
        return `${baseClasses}`;
    }
  };

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
            variant={buttonStyle === 'outline' ? 'outline' : buttonStyle === 'subtle' ? 'ghost' : 'outline'}
            className={getButtonClasses(buttonStyle)}
            style={{ 
              borderColor: `${themeColor}40`,
              color: hasBackgroundImage ? 'white' : undefined,
              backgroundColor: hasBackgroundImage ? 'rgba(0,0,0,0.3)' : undefined
            }}
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
