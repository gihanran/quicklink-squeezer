
import React from 'react';
import { ChartBar } from 'lucide-react';

interface DashboardHeaderProps {
  handleLogout: () => Promise<void>;
  user: any;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ handleLogout, user }) => {
  return (
    <header className="w-full py-6 px-4 bg-white shadow-sm">
      <div className="container max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
                <ChartBar className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                Dashboard
              </h1>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/" 
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Home
            </a>
            {user?.id && (
              <a 
                href="/admin" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Admin
              </a>
            )}
            <button 
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
