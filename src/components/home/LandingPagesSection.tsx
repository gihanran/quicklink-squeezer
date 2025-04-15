
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const BioCardSection: React.FC = () => {
  return (
    <div className="mt-12 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
          Create Your Own Bio Card
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-700 mb-4">
            Create a beautiful bio card to showcase all your important links in one place. Customize your page with different themes, add your profile image, and track visitor analytics.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <div className="h-6 w-6 bg-brand-purple/10 rounded-full flex items-center justify-center mr-2 shrink-0">
                <LayoutGrid className="h-3 w-3 text-brand-purple" />
              </div>
              <span className="text-sm">Fully customizable design</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 bg-brand-blue/10 rounded-full flex items-center justify-center mr-2 shrink-0">
                <LayoutGrid className="h-3 w-3 text-brand-blue" />
              </div>
              <span className="text-sm">Add unlimited links</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 rounded-full flex items-center justify-center mr-2 shrink-0">
                <LayoutGrid className="h-3 w-3 text-brand-purple" />
              </div>
              <span className="text-sm">Track visitor statistics</span>
            </li>
          </ul>
          <Link to="/auth" className="flex items-center text-brand-purple font-medium hover:underline">
            Create Your Bio Card <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <img 
                src="/example-landing-page.png" 
                alt="Bio Card Example" 
                className="w-full h-64 object-cover object-top"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Example Bio Card</h3>
                <p className="text-sm text-gray-600">All your important links in one beautiful page</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BioCardSection;
