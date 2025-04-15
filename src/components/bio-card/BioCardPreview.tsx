
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { LandingPage, LandingPageLink } from "@/types/landingPage";

interface BioCardPreviewProps {
  page: LandingPage;
  links: LandingPageLink[];
  onBack: () => void;
}

const BioCardPreview: React.FC<BioCardPreviewProps> = ({
  page,
  links,
  onBack
}) => {
  const previewUrl = `/p/${page.slug}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">Preview</h2>
        </div>
        <Button
          variant="outline"
          onClick={() => window.open(previewUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">
              {window.location.origin}{previewUrl}
            </p>
          </div>
        </div>
        <div className="p-4 h-[600px] overflow-y-auto">
          <iframe 
            src={previewUrl}
            title={`Preview of ${page.title}`}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default BioCardPreview;
