
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UrlData } from '@/utils/url';
import { useToast } from "@/components/ui/use-toast";
import { Copy, Facebook, Twitter, Linkedin, Link } from "lucide-react";

interface ShortenedUrlResultProps {
  urlData: UrlData;
  shortenedUrl: string;
}

const ShortenedUrlResult: React.FC<ShortenedUrlResultProps> = ({ urlData, shortenedUrl }) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl)
      .then(() => {
        // Show toast
        toast({
          title: "URL copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast({
          title: "Failed to copy URL",
          variant: "destructive"
        });
      });
  };
  
  const shareToSocial = (platform: string) => {
    let shareUrl = '';
    const text = 'Check out this link!';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortenedUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shortenedUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortenedUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  return (
    <Card className="w-full mt-6 border-2 border-brand-purple/20">
      <CardContent className="pt-6 px-4 sm:px-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex-1 truncate">
              <p className="text-sm text-muted-foreground mb-1">Your shortened URL:</p>
              <p className="font-medium text-lg break-all">{shortenedUrl}</p>
            </div>
            <Button 
              onClick={handleCopy}
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity h-10"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-3">Share via:</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10" 
                onClick={() => shareToSocial('facebook')}
              >
                <Facebook className="h-4 w-4 text-blue-600" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10" 
                onClick={() => shareToSocial('twitter')}
              >
                <Twitter className="h-4 w-4 text-sky-500" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10" 
                onClick={() => shareToSocial('linkedin')}
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-10 w-10"
                onClick={handleCopy}
              >
                <Link className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Original URL:</p>
              <p className="text-xs text-muted-foreground">Visits: {urlData.visits}</p>
            </div>
            <p className="font-medium text-sm text-gray-600 truncate">{urlData.originalUrl}</p>
            
            <div className="mt-4 pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Test your link:</p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(shortenedUrl, '_blank')}
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShortenedUrlResult;
