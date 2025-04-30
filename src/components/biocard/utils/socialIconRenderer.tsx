
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageSquare } from 'lucide-react';

export const renderSocialIcon = (platform: string, getSocialIcon?: (platform: string) => React.ReactNode) => {
  if (getSocialIcon) {
    return getSocialIcon(platform);
  }
  
  switch(platform.toLowerCase()) {
    case 'facebook':
      return <Facebook className="h-4 w-4 mr-2" />;
    case 'instagram':
      return <Instagram className="h-4 w-4 mr-2" />;
    case 'twitter':
      return <Twitter className="h-4 w-4 mr-2" />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4 mr-2" />;
    case 'youtube':
      return <Youtube className="h-4 w-4 mr-2" />;
    case 'discord':
      return <MessageSquare className="h-4 w-4 mr-2" />;
    default:
      return null;
  }
};
