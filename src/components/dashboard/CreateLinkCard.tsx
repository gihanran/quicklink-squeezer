
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import AdPopup from "@/components/AdPopup";
import { UrlData } from "@/utils/url/types";

interface CreateLinkCardProps {
  handleLinkCreated: () => void;
  handleUrlShortened: () => void;
}

const CreateLinkCard: React.FC<CreateLinkCardProps> = ({ handleLinkCreated, handleUrlShortened }) => {
  const [showAdPopup, setShowAdPopup] = useState(false);
  
  const handleFormSubmit = (urlData: UrlData, fullUrl: string) => {
    // Open the ad in a new window
    window.open('https://www.profitableratecpm.com/ux9fm65hmy?key=fd2351bc9ac57a148dab2b212d7b6cd2', '_blank');
    
    // Process the link creation immediately
    handleUrlShortened();
    handleLinkCreated();
    
    // Optionally show the popup as a confirmation
    setShowAdPopup(true);
  };
  
  const handleAdComplete = () => {
    setShowAdPopup(false);
  };

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Link</CardTitle>
          <CardDescription>Enter a URL to shorten</CardDescription>
        </CardHeader>
        <CardContent>
          <UrlShortenerForm 
            onUrlShortened={handleFormSubmit} 
            showTitleField={true} 
          />
        </CardContent>
      </Card>
      
      <AdPopup
        open={showAdPopup}
        onClose={() => setShowAdPopup(false)}
        onComplete={handleAdComplete}
      />
    </>
  );
};

export default CreateLinkCard;
