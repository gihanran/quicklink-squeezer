
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import ShortenedUrlResult from '@/components/ShortenedUrlResult';
import FeatureShowcase from '@/components/FeatureShowcase';
import { UrlData } from '@/utils/url';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Layouts, BarChart2 } from "lucide-react";
import { useAuthState } from '@/hooks/auth';
import Footer from '@/components/Footer';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [shortenedUrlData, setShortenedUrlData] = useState<UrlData | null>(null);
  const [fullShortenedUrl, setFullShortenedUrl] = useState<string>('');
  const [landingPagesCount, setLandingPagesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthState();

  useEffect(() => {
    const fetchLandingPagesCount = async () => {
      try {
        const { count, error } = await supabase
          .from('landing_pages')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        setLandingPagesCount(count || 0);
      } catch (error) {
        console.error('Error fetching landing pages count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPagesCount();
  }, []);

  const handleUrlShortened = (urlData: UrlData, fullUrl: string) => {
    setShortenedUrlData(urlData);
    setFullShortenedUrl(fullUrl);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
                <Link2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                Shortit
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth" className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </Link>
                  <Link 
                    to="/auth" 
                    className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container max-w-4xl mx-auto px-4 py-10">
          <Card className="w-full shadow-lg border-none">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold">Shorten Your URL</CardTitle>
              <CardDescription className="text-lg mt-2">
                Simplify your links and track clicks - no registration required
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <UrlShortenerForm 
                onUrlShortened={handleUrlShortened} 
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

          {/* New Landing Pages Section */}
          <div className="mt-12 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                  Create Beautiful Landing Pages
                </h2>
                <p className="text-gray-700 mt-2">
                  Design and publish customized landing pages to showcase all your important links in one place
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-center">
                  <span className="text-3xl font-bold text-brand-purple">{loading ? '...' : landingPagesCount}</span>
                  <p className="text-sm text-gray-600">Landing Pages Created</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-md shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-brand-purple/10 rounded-full flex items-center justify-center mb-3">
                  <Layouts className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="font-medium mb-2">Customized Design</h3>
                <p className="text-sm text-gray-600">Personalize your landing page with custom themes and profile images.</p>
              </div>
              
              <div className="bg-white p-5 rounded-md shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-3">
                  <Link2 className="h-6 w-6 text-brand-blue" />
                </div>
                <h3 className="font-medium mb-2">Multiple Links</h3>
                <p className="text-sm text-gray-600">Add all your important links in one page and organize them easily.</p>
              </div>
              
              <div className="bg-white p-5 rounded-md shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 rounded-full flex items-center justify-center mb-3">
                  <BarChart2 className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="font-medium mb-2">Detailed Analytics</h3>
                <p className="text-sm text-gray-600">Track views and clicks to understand your audience better.</p>
              </div>
            </div>
            
            {user ? (
              <div className="mt-6 text-center">
                <Link 
                  to="/dashboard" 
                  className="px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90 inline-block"
                >
                  Create Landing Page
                </Link>
              </div>
            ) : (
              <div className="mt-6 text-center">
                <Link 
                  to="/auth" 
                  className="px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90 inline-block"
                >
                  Sign Up to Create Landing Pages
                </Link>
              </div>
            )}
          </div>

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
                <h3 className="font-medium mb-2">Short It</h3>
                <p className="text-sm text-gray-600">Click the Short It button to generate your short link.</p>
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
        </div>
        
        <FeatureShowcase />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
