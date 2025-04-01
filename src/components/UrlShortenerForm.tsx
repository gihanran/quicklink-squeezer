
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storeUrl, getFullShortenedUrl, UrlData } from '@/utils/urlUtils';
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

interface UrlShortenerFormProps {
  onUrlShortened: (urlData: UrlData, fullUrl: string) => void;
  onSuccess?: () => void; // Add this optional prop for Dashboard
}

const UrlShortenerForm: React.FC<UrlShortenerFormProps> = ({ onUrlShortened, onSuccess }) => {
  const [url, setUrl] = useState<string>('');
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
      const urlData = await storeUrl(urlToShorten);
      const fullShortenedUrl = getFullShortenedUrl(urlData.shortCode);
      
      // Callback to parent component with the shortened URL
      onUrlShortened(urlData, fullShortenedUrl);
      
      // Call onSuccess if provided (for Dashboard)
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setUrl('');
      toast({
        title: "URL shortened successfully!",
        description: "Your short link is ready to share.",
      });
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast({ 
        title: "Failed to shorten URL",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
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
    </form>
  );
};

export default UrlShortenerForm;
