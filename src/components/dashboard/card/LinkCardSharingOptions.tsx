
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2, Copy, Facebook, Twitter, Linkedin } from "lucide-react";

interface LinkCardSharingOptionsProps {
  fullUrl: string;
  link: any;
  handleCopy: () => void;
}

const LinkCardSharingOptions: React.FC<LinkCardSharingOptionsProps> = ({ 
  fullUrl, 
  link,
  handleCopy 
}) => {
  const [showSharingOptions, setShowSharingOptions] = useState(false);
  
  const shareToSocial = (platform: string) => {
    let shareUrl = '';
    const text = link.title || 'Check out this link!';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(fullUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  return (
    <div className="border-t pt-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium">Share this link</p>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={() => setShowSharingOptions(!showSharingOptions)}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
      
      {showSharingOptions && (
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 border-blue-600" 
            onClick={() => shareToSocial('facebook')}
          >
            <Facebook className="h-4 w-4 text-blue-600" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 border-sky-500" 
            onClick={() => shareToSocial('twitter')}
          >
            <Twitter className="h-4 w-4 text-sky-500" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8 border-blue-700" 
            onClick={() => shareToSocial('linkedin')}
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-8 w-8"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default LinkCardSharingOptions;
