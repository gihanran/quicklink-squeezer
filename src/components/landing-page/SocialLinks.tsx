
import React from 'react';
import { SocialMediaLink } from '@/types/landingPage';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  variant?: 'default' | 'outline' | 'ghost' | 'soft' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  shape?: 'default' | 'round' | 'pill';
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

const buttonStyles = {
  default: "",
  outline: "border border-gray-200 hover:bg-gray-50",
  ghost: "hover:bg-gray-100",
  soft: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  gradient: "bg-gradient-to-r from-brand-purple to-brand-blue text-white hover:opacity-90"
};

const shapeStyles = {
  default: "rounded-md",
  round: "rounded-full",
  pill: "rounded-full px-6"
};

const SocialLinks: React.FC<SocialLinksProps> = ({ 
  links, 
  onLinkClick,
  variant = 'default',
  size = 'icon',
  shape = 'round'
}) => {
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
            variant={variant === 'default' ? 'ghost' : variant}
            size={size}
            onClick={() => handleClick(link)}
            className={cn(
              buttonStyles[variant],
              shapeStyles[shape],
              "transition-all duration-200"
            )}
          >
            <IconComponent className={cn(
              "h-5 w-5",
              variant !== 'gradient' ? "text-gray-600" : "text-white"
            )} />
          </Button>
        );
      })}
    </div>
  );
};

export default SocialLinks;
