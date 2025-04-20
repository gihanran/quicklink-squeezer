
import React, { useEffect, useRef } from 'react';

const BioCardAd: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create and inject the first script (atOptions)
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.text = `
      atOptions = {
        'key' : '8f16a4e70ba2c3e74ea50c0eef897f95',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    
    // Create and inject the second script (invoke.js)
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.async = true;
    invokeScript.src = '//www.highperformanceformat.com/8f16a4e70ba2c3e74ea50c0eef897f95/invoke.js';

    if (adContainerRef.current) {
      adContainerRef.current.appendChild(optionsScript);
      adContainerRef.current.appendChild(invokeScript);
    }

    // Cleanup function
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-4">
      <div ref={adContainerRef}></div>
    </div>
  );
};

export default BioCardAd;
