
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
  const [redirectAttempted, setRedirectAttempted] = useState<boolean>(false);

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

        console.log(`Found URL data:`, urlData);

        // Set meta information if available
        if (urlData.title) {
          setPageTitle(urlData.title);
        }
        
        if (urlData.description) {
          setPageDescription(urlData.description);
        }

        // Make sure the URL has a protocol
        let redirectUrl = urlData.originalUrl;
        if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
          redirectUrl = 'https://' + redirectUrl;
          console.log(`Added https protocol to URL: ${redirectUrl}`);
        }

        setOriginalUrl(redirectUrl);
        
        // Track the visit before redirecting
        try {
          await trackVisit(shortCode);
          console.log('Successfully tracked visit');
        } catch (trackError) {
          console.error('Error tracking visit, but continuing with redirect:', trackError);
        }
        
        // Set redirect attempted flag
        setRedirectAttempted(true);
        
        // Method 1: Direct browser redirection - the most reliable way for same-origin redirects
        console.log(`Redirecting to: ${redirectUrl}`);
        window.location.href = redirectUrl;
        
        // Method 2: As a fallback, try with replace after a short delay
        // This can help with some cross-origin situations
        setTimeout(() => {
          if (document.visibilityState !== 'hidden') {
            console.log('Trying redirect with window.location.replace as fallback');
            window.location.replace(redirectUrl);
          }
        }, 300);
      } catch (err) {
        console.error('Redirect error:', err);
        setError('An error occurred while redirecting. Please try again.');
        setLoading(false);
      }
    };

    // Execute the redirect
    handleRedirect();
  }, [shortCode]);

  if (loading && !redirectAttempted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <MetaTags title="Redirecting..." />
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl">Redirecting to destination...</p>
          <p className="text-sm text-gray-500 mt-2">You will be redirected shortly. If not, please click the link below.</p>
          {originalUrl && (
            <a 
              href={originalUrl} 
              className="text-blue-500 hover:underline block mt-4" 
              rel="noopener noreferrer"
              target="_blank"
            >
              Click here to visit the link directly
            </a>
          )}
        </div>
      </div>
    );
  }

  // Show manual redirect option after automatic redirect has been attempted
  if (redirectAttempted && originalUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <MetaTags 
          title={pageTitle || "Click to Continue"} 
          description={pageDescription || "Your redirect is ready"}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Click to Continue</h1>
          <p className="mb-6">If you're not automatically redirected, please click the button below:</p>
          <a 
            href={originalUrl} 
            className="px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90 inline-block"
            rel="noopener noreferrer"
            target="_blank"
          >
            Continue to Destination
          </a>
          <p className="text-sm text-gray-500 mt-4">
            Destination: {originalUrl}
          </p>
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

  // This will only be shown briefly before the redirect happens
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        url={originalUrl || window.location.href}
      />
      <div className="text-center">
        <div className="mb-4 animate-pulse">
          <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-xl">Redirecting to destination...</p>
        {originalUrl && (
          <a 
            href={originalUrl} 
            className="text-blue-500 hover:underline block mt-4" 
            rel="noopener noreferrer" 
            target="_blank"
          >
            Click here if you're not automatically redirected
          </a>
        )}
      </div>
    </div>
  );
};

export default Redirect;
