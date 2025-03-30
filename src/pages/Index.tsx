
import React, { useState } from 'react';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import ShortenedUrlResult from '@/components/ShortenedUrlResult';
import { UrlData } from '@/utils/urlUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2 } from "lucide-react";

const Index = () => {
  const [shortenedUrlData, setShortenedUrlData] = useState<UrlData | null>(null);
  const [fullShortenedUrl, setFullShortenedUrl] = useState<string>('');

  const handleUrlShortened = (urlData: UrlData, fullUrl: string) => {
    setShortenedUrlData(urlData);
    setFullShortenedUrl(fullUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
              <Link2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              QuickLink Squeezer
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-4xl mx-auto px-4 py-10">
        <Card className="w-full shadow-lg border-none">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold">Shorten Your URL</CardTitle>
            <CardDescription className="text-lg mt-2">
              Simplify your links and track clicks - no registration required
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <UrlShortenerForm onUrlShortened={handleUrlShortened} />
            
            {shortenedUrlData && (
              <ShortenedUrlResult 
                urlData={shortenedUrlData} 
                shortenedUrl={fullShortenedUrl} 
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-md">
              <div className="h-10 w-10 bg-brand-purple/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-brand-purple font-bold">1</span>
              </div>
              <h3 className="font-medium mb-2">Paste your URL</h3>
              <p className="text-sm text-gray-600">Enter your long URL into the input field above.</p>
            </div>
            <div className="p-4 border rounded-md">
              <div className="h-10 w-10 bg-brand-blue/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-brand-blue font-bold">2</span>
              </div>
              <h3 className="font-medium mb-2">Shorten it</h3>
              <p className="text-sm text-gray-600">Click the Shorten URL button to generate your short link.</p>
            </div>
            <div className="p-4 border rounded-md">
              <div className="h-10 w-10 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 rounded-full flex items-center justify-center mb-3">
                <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent font-bold">3</span>
              </div>
              <h3 className="font-medium mb-2">Share your link</h3>
              <p className="text-sm text-gray-600">Copy and share your shortened URL with anyone.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 bg-white border-t">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuickLink Squeezer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
