
import React, { useState } from 'react';
import { UrlData } from '@/utils/url';
import { useAuthState } from '@/hooks/auth';
import Footer from '@/components/Footer';
import FeatureShowcase from '@/components/FeatureShowcase';
import HomeHeader from '@/components/home/HomeHeader';
import UrlShortener from '@/components/home/UrlShortener';
import LandingPagePromo from '@/components/home/LandingPagePromo';
import HowItWorks from '@/components/home/HowItWorks';
import LandingPagesSection from '@/components/home/LandingPagesSection';

const Index = () => {
  const [shortenedUrlData, setShortenedUrlData] = useState<UrlData | null>(null);
  const [fullShortenedUrl, setFullShortenedUrl] = useState<string>('');
  const { user } = useAuthState();

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
          
          <LandingPagePromo user={user} />

          <HowItWorks />
          
          <LandingPagesSection />
        </div>
        
        <FeatureShowcase />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
