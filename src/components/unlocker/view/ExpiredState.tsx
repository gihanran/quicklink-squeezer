
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import MetaTags from '@/components/MetaTags';

const ExpiredState: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <MetaTags title="Link Expired" />
          <div className="bg-amber-100 rounded-full p-3 inline-flex mb-4">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-amber-600 mb-4">Link Expired</h1>
          <p className="mb-6">This URL unlocker link has expired and is no longer available.</p>
          <Link 
            to="/" 
            className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
          >
            Go back to homepage
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ExpiredState;
