
import React from 'react';
import { Link } from 'react-router-dom';
import { Link2 } from "lucide-react";
import { User } from '@supabase/supabase-js';

interface HomeHeaderProps {
  user: User | null;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  return (
    <header className="w-full py-6 px-4 bg-white shadow-sm">
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
              <Link2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              Shortit
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
