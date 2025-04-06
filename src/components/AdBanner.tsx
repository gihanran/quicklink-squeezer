
import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create and inject the script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl26116430.effectiveratecpm.com/17/9d/65/179d6589a4ee5873eab2d6a953fb2232.js';
    adContainerRef.current?.appendChild(script);

    // Cleanup function
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-4 bg-gray-50">
      <div ref={adContainerRef} className="ad-container"></div>
    </div>
  );
};

export default AdBanner;
