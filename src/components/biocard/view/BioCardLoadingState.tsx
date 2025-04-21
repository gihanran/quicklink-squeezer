
import React from 'react';

interface BioCardLoadingStateProps {
  message?: string;
}

export const BioCardLoadingState: React.FC<BioCardLoadingStateProps> = ({ 
  message = "Loading bio card..." 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple mb-4"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};
