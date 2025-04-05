
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUrlByShortCode, trackVisit } from '@/utils/url';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!shortCode) {
      navigate('/');
      return;
    }

    const handleRedirect = async () => {
      try {
        const urlData = await getUrlByShortCode(shortCode);
        
        if (!urlData) {
          setError('Sorry, this link does not exist or has expired.');
          return;
        }

        // Track the visit
        await trackVisit(shortCode);
        
        // Redirect to the original URL
        window.location.href = urlData.originalUrl;
      } catch (err) {
        console.error('Redirect error:', err);
        setError('An error occurred while redirecting. Please try again.');
      }
    };

    // Execute the redirect
    handleRedirect();
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Link Not Found</h1>
          <p className="mb-6">{error}</p>
          <a 
            href="/" 
            className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
          >
            Go back to homepage
          </a>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl">Redirecting you to your destination...</p>
        </div>
      )}
    </div>
  );
};

export default Redirect;
