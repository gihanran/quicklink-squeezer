
import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-md">
          <div className="h-10 w-10 bg-brand-purple/10 rounded-full flex items-center justify-center mb-3">
            <span className="text-brand-purple font-bold">1</span>
          </div>
          <h3 className="font-medium mb-2">Paste your URL</h3>
          <p className="text-sm text-gray-600">Enter your long URL into the input field above.</p>
        </div>
        <div className="p-4 border rounded-md">
          <div className="h-10 w-10 bg-brand-blue/10 rounded-full flex items-center justify-center mb-3">
            <span className="text-brand-blue font-bold">2</span>
          </div>
          <h3 className="font-medium mb-2">Short It</h3>
          <p className="text-sm text-gray-600">Click the Short It button to generate your short link.</p>
        </div>
        <div className="p-4 border rounded-md">
          <div className="h-10 w-10 bg-gradient-to-r from-brand-purple/10 to-brand-blue/10 rounded-full flex items-center justify-center mb-3">
            <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent font-bold">3</span>
          </div>
          <h3 className="font-medium mb-2">Share your link</h3>
          <p className="text-sm text-gray-600">Copy and share your shortened URL with anyone.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
