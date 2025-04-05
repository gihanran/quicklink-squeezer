
import React from 'react';
import { Button } from "@/components/ui/button";

interface LinksHeaderProps {
  handleCreateNewLink: () => void;
}

const LinksHeader: React.FC<LinksHeaderProps> = ({ handleCreateNewLink }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Your Links Dashboard</h1>
        <p className="text-gray-600">Track and manage your shortened links</p>
      </div>
      <Button 
        onClick={handleCreateNewLink}
        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
      >
        Create New Link
      </Button>
    </div>
  );
};

export default LinksHeader;
