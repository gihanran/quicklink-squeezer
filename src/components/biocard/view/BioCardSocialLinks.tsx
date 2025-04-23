
import React from 'react';
import { ExternalLink, Facebook, Instagram, Twitter, Linkedin, Youtube, Share2 } from 'lucide-react';
import type { BioCardSocialLink } from '@/types/bioCardTypes';

interface BioCardSocialLinksProps {
  socialLinks: BioCardSocialLink[];
  onLinkClick: (linkId: string) => void;
  onShare: () => void;
}

export const BioCardSocialLinks: React.FC<BioCardSocialLinksProps> = ({ 
  socialLinks, 
  onLinkClick,
  onShare
}) => {
  const getSocialIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {socialLinks.map((socialLink) => (
        <a 
          key={socialLink.id}
          href={socialLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow"
          onClick={() => onLinkClick(socialLink.id)}
        >
          {getSocialIcon(socialLink.platform)}
        </a>
      ))}
      
      <button
        onClick={onShare}
        className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:shadow-md transition-shadow"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
};
