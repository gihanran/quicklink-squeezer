
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
  const [pendingUrlData, setPendingUrlData] = useState<{urlData: UrlData; fullUrl: string} | null>(null);
  
  const handleFormSubmit = (urlData: UrlData, fullUrl: string) => {
    // Store the URL data temporarily and show the ad popup
    setPendingUrlData({ urlData, fullUrl });
    setShowAdPopup(true);
  };
  
  const handleAdComplete = () => {
    // After ad is viewed and closed, complete the link creation process
    if (pendingUrlData) {
      handleUrlShortened();
      handleLinkCreated();
      setPendingUrlData(null);
    }
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
        adScript={true}
      />
    </>
  );
};

export default CreateLinkCard;
