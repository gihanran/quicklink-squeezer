
import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="w-full py-6 bg-white border-t mt-auto">
      <div className="container max-w-6xl mx-auto px-4">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} QuickLink Squeezer. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
