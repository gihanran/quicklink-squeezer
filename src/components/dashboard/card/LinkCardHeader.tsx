
import React from 'react';
import { Pencil } from "lucide-react";

interface LinkCardHeaderProps {
  link: any;
  handleEditTitle: (link: any) => void;
  handleCopy: () => void;
  fullUrl: string;
}

const LinkCardHeader: React.FC<LinkCardHeaderProps> = ({ 
  link, 
  handleEditTitle, 
  handleCopy,
  fullUrl
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
      <div>
        <h3 className="text-lg font-semibold mb-1 truncate max-w-md flex items-center">
          {link.title || link.originalUrl}
          <button 
            className="ml-2 p-1 hover:bg-gray-100 rounded-full"
            onClick={() => handleEditTitle(link)}
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </button>
        </h3>
        <div className="flex items-center">
          <span className="text-brand-purple font-medium mr-2">
            {fullUrl}
          </span>
          <button 
            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 mr-2"
            onClick={handleCopy}
          >
            Copy
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1 truncate max-w-md">
          {link.originalUrl}
        </div>
      </div>
      <div className="flex items-center mt-4 md:mt-0">
        <span className="text-lg font-medium mr-3">{link.visits} clicks</span>
        <button className="text-secondary-foreground bg-secondary hover:bg-secondary/80 h-9 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors mr-2">
          View Details
        </button>
        <button 
          className="text-destructive-foreground bg-destructive hover:bg-destructive/90 h-9 rounded-md px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors"
          onClick={() => link.handleDeleteLink(link)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default LinkCardHeader;
