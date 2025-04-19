
import React, { useState, useEffect } from 'react';
import { UrlData } from '@/utils/url';
import { useAuthState } from '@/hooks/auth';
import Footer from '@/components/Footer';
import FeatureShowcase from '@/components/FeatureShowcase';
import HomeHeader from '@/components/home/HomeHeader';
import UrlShortener from '@/components/home/UrlShortener';
import HowItWorks from '@/components/home/HowItWorks';
import FAQ from '@/components/home/FAQ';

const Index = () => {
  const [shortenedUrlData, setShortenedUrlData] = useState<UrlData | null>(null);
  const [fullShortenedUrl, setFullShortenedUrl] = useState<string>('');
  const { user } = useAuthState();

  // Update document title and meta description for SEO
  useEffect(() => {
    document.title = "Shortit - Simple & Free URL Shortener";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Create short, memorable links instantly with Shortit. Professional URL shortener with analytics, custom domains, and link management.");
    }
  }, []);

  const handleUrlShortened = (urlData: UrlData, fullUrl: string) => {
    setShortenedUrlData(urlData);
    setFullShortenedUrl(fullUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <HomeHeader user={user} />

      <main className="flex-grow">
        <div className="container max-w-4xl mx-auto px-4 py-10">
          <UrlShortener 
            onUrlShortened={handleUrlShortened} 
            shortenedUrlData={shortenedUrlData} 
            fullShortenedUrl={fullShortenedUrl} 
          />
          
          <HowItWorks />
        </div>
        
        <FeatureShowcase />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
