
import React from 'react';
import { UrlData } from '@/utils/url';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import ShortenedUrlResult from '@/components/ShortenedUrlResult';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UrlShortenerProps {
  onUrlShortened: (urlData: UrlData, fullUrl: string) => void;
  shortenedUrlData: UrlData | null;
  fullShortenedUrl: string;
}

const UrlShortener: React.FC<UrlShortenerProps> = ({ 
  onUrlShortened, 
  shortenedUrlData, 
  fullShortenedUrl 
}) => {
  return (
    <Card className="w-full shadow-lg border-none">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold">Shorten Your URL</CardTitle>
        <CardDescription className="text-lg mt-2">
          Simplify your links and track clicks - no registration required
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-8">
        <UrlShortenerForm 
          onUrlShortened={onUrlShortened} 
          showTitleField={false} // Hide the title field on the home page
        />
        
        {shortenedUrlData && (
          <ShortenedUrlResult 
            urlData={shortenedUrlData} 
            shortenedUrl={fullShortenedUrl} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default UrlShortener;
