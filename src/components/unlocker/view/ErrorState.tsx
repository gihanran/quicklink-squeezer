
import React from 'react';
import { Link } from 'react-router-dom';
import MetaTags from '@/components/MetaTags';

interface ErrorStateProps {
  title: string;
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, message }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <MetaTags title={title} />
          <h1 className="text-2xl font-bold text-red-500 mb-4">{title}</h1>
          <p className="mb-6">{message}</p>
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

export default ErrorState;
