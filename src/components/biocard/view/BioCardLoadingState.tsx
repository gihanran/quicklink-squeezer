
import React from 'react';

export const BioCardLoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
    </div>
  );
};
