
import React, { useEffect, useRef } from 'react';

const AdBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create and inject the first script (atOptions)
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.text = `
      atOptions = {
        'key' : '10fe1b4b47f15cfeeae0b2c57466fc41',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    adContainerRef.current?.appendChild(optionsScript);

    // Create and inject the second script (invoke.js)
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = '//www.highperformanceformat.com/10fe1b4b47f15cfeeae0b2c57466fc41/invoke.js';
    adContainerRef.current?.appendChild(invokeScript);

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
