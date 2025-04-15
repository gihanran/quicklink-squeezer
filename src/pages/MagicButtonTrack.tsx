
import React from 'react';
import { Link } from 'react-router-dom';

// This component is now deprecated as tracking is handled directly in the MagicButton component
const MagicButtonTrack: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-amber-500 mb-4">Deprecated</h1>
        <p className="mb-6">This page is no longer in use. Tracking is now handled directly.</p>
        <Link 
          to="/" 
          className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
        >
          Go back to homepage
        </Link>
      </div>
    </div>
  );
};

export default MagicButtonTrack;
