
import React from 'react';
import MetaTags from '@/components/MetaTags';

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <MetaTags title="Loading..." />
          <div className="mb-4 animate-pulse">
            <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl">Loading...</p>
        </div>
      </main>
    </div>
  );
};

export default LoadingState;
