
import React from 'react';
import { SocialMediaLink } from '@/types/landingPage';
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Github,
  Globe
} from 'lucide-react';

interface SocialLinksProps {
  links: SocialMediaLink[];
  onLinkClick?: (link: SocialMediaLink) => void;
}

const platformIcons: Record<string, React.ComponentType> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  website: Globe
};

const SocialLinks: React.FC<SocialLinksProps> = ({ links, onLinkClick }) => {
  if (!links || links.length === 0) return null;

  const handleClick = (link: SocialMediaLink) => {
    if (onLinkClick) {
      onLinkClick(link);
    }
    window.open(link.url, '_blank');
  };

  return (
    <div className="flex justify-center gap-3 mt-6">
      {links.map((link) => {
        const IconComponent = platformIcons[link.platform.toLowerCase()] || Globe;
        return (
          <Button
            key={link.id}
            variant="ghost"
            size="icon"
            onClick={() => handleClick(link)}
            className="rounded-full hover:bg-gray-100"
          >
            <IconComponent className="h-5 w-5 text-gray-600" />
          </Button>
        );
      })}
    </div>
  );
};

export default SocialLinks;
