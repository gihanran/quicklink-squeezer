
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Globe, Smartphone, Pencil, Share2, Copy, Facebook, Twitter, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkCardProps {
  link: any;
  calculateExpiration: (createdAt: number, expiresAt?: number) => { percentage: number, daysLeft: number };
  handleDeleteLink: (link: any) => void;
  handleEditTitle: (link: any) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ 
  link, 
  calculateExpiration,
  handleDeleteLink,
  handleEditTitle
}) => {
  const { toast } = useToast();
  const [showSharingOptions, setShowSharingOptions] = React.useState(false);
  const { percentage, daysLeft } = calculateExpiration(link.createdAt, link.expiresAt);
  
  const fullUrl = `${window.location.origin}/s/${link.shortCode}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    toast({ description: "Link copied to clipboard" });
  };

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
    <Card key={link.id} className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1 truncate max-w-md flex items-center">
                {link.title || link.originalUrl}
                <button 
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => handleEditTitle(link)}
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </button>
              </h3>
              <div className="flex items-center">
                <span className="text-brand-purple font-medium mr-2">
                  {fullUrl}
                </span>
                <button 
                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 mr-2"
                  onClick={handleCopy}
                >
                  Copy
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1 truncate max-w-md">
                {link.originalUrl}
              </div>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-lg font-medium mr-3">{link.visits} clicks</span>
              <Button variant="secondary" size="sm" className="mr-2">
                View Details
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDeleteLink(link)}
              >
                Delete
              </Button>
            </div>
          </div>
          
          {link.expiresAt && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Link expiration</span>
                <span>{daysLeft} days left</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <Smartphone className="h-5 w-5 text-brand-purple mr-2" />
              <div>
                <p className="text-xs text-gray-500">Devices</p>
                <p className="text-sm">
                  {link.devices ? (
                    `Desktop: ${link.devices.desktop || 0}, Mobile: ${link.devices.mobile || 0}`
                  ) : "No data yet"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-brand-blue mr-2" />
              <div>
                <p className="text-xs text-gray-500">Top Locations</p>
                <p className="text-sm truncate">
                  {link.locations ? (
                    Object.entries(link.locations)
                      .slice(0, 2)
                      .map(([country, count]) => `${country}: ${count}`)
                      .join(', ')
                  ) : "No data yet"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm">
                  {new Date(link.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Share section */}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;
