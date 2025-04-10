
import React, { useEffect } from 'react';
import LinksList from "../LinksList";
import { UrlData } from "@/utils/url/types";

interface LinksListSectionProps {
  links: UrlData[];
  loading: boolean;
  calculateExpiration: (createdAt: number, expiresAt?: number) => { percentage: number, daysLeft: number };
  handleCreateNewLink: () => void;
  handleDeleteLink: (link: UrlData) => void;
  handleEditTitle: (link: UrlData) => void;
}

const LinksListSection: React.FC<LinksListSectionProps> = ({
  links,
  loading,
  calculateExpiration,
  handleCreateNewLink,
  handleDeleteLink,
  handleEditTitle
}) => {
  // Add effect to inject the ad script
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl26346008.profitableratecpm.com/37/89/81/378981276f8c95e8b6edb72975f7c5be.js';
    script.async = true;
    
    // Add to ad container
    const adContainer = document.getElementById('ad-container-links');
    if (adContainer) {
      // Clear any existing content
      adContainer.innerHTML = '';
      adContainer.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      if (adContainer && script.parentNode === adContainer) {
        adContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Links</h2>
      
      {/* Ad container - positioned right under the header */}
      <div id="ad-container-links" className="w-full min-h-[100px] mb-6 flex justify-center items-center">
        {/* Ad script will be injected here */}
      </div>
      
      <LinksList 
        links={links} 
        loading={loading}
        calculateExpiration={calculateExpiration}
        handleCreateNewLink={handleCreateNewLink}
        handleDeleteLink={handleDeleteLink}
        handleEditTitle={handleEditTitle}
      />
    </>
  );
};

export default LinksListSection;
