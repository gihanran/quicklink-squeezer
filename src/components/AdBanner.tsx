
import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create and inject the script
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl26346283.profitableratecpm.com/10e0dcde14080101e2d150c60e1fa610/invoke.js';
    
    // Append the script to the document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-4 bg-gray-50">
      <div id="container-10e0dcde14080101e2d150c60e1fa610"></div>
    </div>
  );
};

export default AdBanner;
