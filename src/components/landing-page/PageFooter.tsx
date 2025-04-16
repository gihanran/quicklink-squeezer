
import React from 'react';

interface PageFooterProps {
  hasBackgroundImage: boolean;
  themeColor: string;
}

const PageFooter: React.FC<PageFooterProps> = ({ hasBackgroundImage, themeColor }) => {
  return (
    <div className="pt-8 text-center">
      <p className={`text-sm ${hasBackgroundImage ? 'text-white text-opacity-70' : 'text-gray-400'}`}>
        Powered by <a 
          href="/" 
          className="hover:underline"
          style={{ color: hasBackgroundImage ? 'white' : themeColor }}
        >
          Shortit
        </a>
      </p>
    </div>
  );
};

export default PageFooter;
