
import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, ExternalLink } from 'lucide-react';
import { SocialMediaLink } from '@/types/landingPage';

interface SocialLinksProps {
  socialLinks: SocialMediaLink[];
  themeColor: string;
  hasBackgroundImage: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks, themeColor, hasBackgroundImage }) => {
  if (!socialLinks || socialLinks.length === 0) {
    return null;
  }

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      default:
        return <ExternalLink size={20} />;
    }
  };

  return (
    <div className="flex justify-center gap-4 my-4">
      {socialLinks.map((social, index) => (
        <a 
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-full ${hasBackgroundImage ? 'bg-white text-gray-800' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          style={{ color: themeColor }}
        >
          {getSocialIcon(social.platform)}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
