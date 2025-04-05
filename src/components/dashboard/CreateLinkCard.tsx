
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UrlShortenerForm from "@/components/UrlShortenerForm";

interface CreateLinkCardProps {
  handleLinkCreated: () => void;
  handleUrlShortened: () => void;
}

const CreateLinkCard: React.FC<CreateLinkCardProps> = ({ handleLinkCreated, handleUrlShortened }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create New Link</CardTitle>
        <CardDescription>Enter a URL to shorten</CardDescription>
      </CardHeader>
      <CardContent>
        <UrlShortenerForm 
          onUrlShortened={handleUrlShortened} 
          onSuccess={handleLinkCreated} 
        />
      </CardContent>
    </Card>
  );
};

export default CreateLinkCard;
