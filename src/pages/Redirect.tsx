
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUrlByShortCode, trackVisit } from '@/utils/url';
import MetaTags from '@/components/MetaTags';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Redirecting...');
  const [pageDescription, setPageDescription] = useState<string>('');

  useEffect(() => {
    if (!shortCode) {
      setError('Invalid short code');
      setLoading(false);
      return;
    }

    const handleRedirect = async () => {
      try {
        console.log(`Attempting to redirect with shortCode: ${shortCode}`);
        const urlData = await getUrlByShortCode(shortCode);
        
        if (!urlData) {
          setError('Sorry, this link does not exist or has expired.');
          setLoading(false);
          return;
        }

        // Set meta information if available
        if (urlData.title) {
          setPageTitle(urlData.title);
        }
        
        if (urlData.description) {
          setPageDescription(urlData.description);
        }

        // Track the visit before redirecting
        const trackingResult = await trackVisit(shortCode);
        console.log(`Tracking result: ${trackingResult ? 'Success' : 'Failed'}`);
        
        // Set the original URL for the iframe
        setOriginalUrl(urlData.originalUrl);
        setLoading(false);
      } catch (err) {
        console.error('Redirect error:', err);
        setError('An error occurred while redirecting. Please try again.');
        setLoading(false);
      }
    };

    // Execute the redirect
    handleRedirect();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <MetaTags title="Redirecting..." />
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <MetaTags 
          title="Link Not Found" 
          description={error}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Link Not Found</h1>
          <p className="mb-6">{error}</p>
          <Link 
            to="/" 
            className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
          >
            Go back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        url={originalUrl || window.location.href}
      />
      {/* Embedded content */}
      {originalUrl && (
        <iframe 
          src={originalUrl} 
          className="w-full h-full min-h-screen" 
          title="Original content"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      )}
    </div>
  );
};

export default Redirect;
