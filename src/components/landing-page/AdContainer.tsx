
import React, { useEffect, useRef } from 'react';

const AdContainer: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current) {
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.text = `
        atOptions = {
          'key' : '8f16a4e70ba2c3e74ea50c0eef897f95',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      
      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = '//www.highperformanceformat.com/8f16a4e70ba2c3e74ea50c0eef897f95/invoke.js';
      
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
        adContainerRef.current.appendChild(atOptionsScript);
        adContainerRef.current.appendChild(adScript);
      }
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-6">
      <div ref={adContainerRef} className="ad-container" />
    </div>
  );
};

export default AdContainer;
