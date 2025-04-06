import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storeUrl, getFullShortenedUrl, UrlData } from '@/utils/url';
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface UrlShortenerFormProps {
  onUrlShortened: (urlData: UrlData, fullUrl: string) => void;
  onSuccess?: () => void; // This is now optional since we handle it differently
  showTitleField?: boolean;
}

const UrlShortenerForm: React.FC<UrlShortenerFormProps> = ({ 
  onUrlShortened, 
  onSuccess,
  showTitleField = true
}) => {
  const [url, setUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // URL validation helper function
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    if (!url.trim()) {
      toast({ 
        title: "Please enter a URL",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure URL has HTTP/HTTPS protocol
    let urlToShorten = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToShorten = `https://${url}`;
    }
    
    if (!isValidUrl(urlToShorten)) {
      toast({ 
        title: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // Include the title in the URL data only if showTitleField is true
      const urlData = await storeUrl(urlToShorten, showTitleField ? title : undefined);
      const fullShortenedUrl = getFullShortenedUrl(urlData.shortCode);
      
      // Callback to parent component with the shortened URL
      onUrlShortened(urlData, fullShortenedUrl);
      
      // Reset form - we'll keep this for any forms not using the ad popup
      setUrl('');
      setTitle('');
      
      // If there's a direct success handler, call it (for backward compatibility)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error shortening URL:', error);
      toast({ 
        title: error.message || "Failed to shorten URL",
        description: error.message === "You have reached your monthly link creation limit" 
          ? "Please try again next month or contact support for a limit increase." 
          : "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="url" className="mb-1 block">URL to Shorten</Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your long URL here"
              className="flex-1 h-12 text-base"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity h-12 px-6"
              disabled={isLoading}
            >
              Shorten URL
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {showTitleField && (
          <div>
            <Label htmlFor="title" className="mb-1 block">Link Title (Optional)</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your link"
              className="w-full h-12 text-base"
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default UrlShortenerForm;
