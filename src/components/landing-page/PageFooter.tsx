
import React from 'react';

const PageFooter: React.FC = () => {
  return (
    <div className="pt-8 text-center">
      <p className="text-sm text-gray-400">
        Powered by <a 
          href="/" 
          className="hover:underline"
        >
          Shortit
        </a>
      </p>
    </div>
  );
};

export default PageFooter;
