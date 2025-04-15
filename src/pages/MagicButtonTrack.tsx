
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { incrementMagicButtonClicks } from '@/services/magicButtonService';

const MagicButtonTrack: React.FC = () => {
  const { buttonId } = useParams<{ buttonId: string }>();
  
  useEffect(() => {
    if (!buttonId) return;
    
    const trackButtonClick = async () => {
      try {
        await incrementMagicButtonClicks(buttonId);
        window.close();
      } catch (error) {
        console.error('Error tracking magic button click:', error);
      }
    };
    
    trackButtonClick();
  }, [buttonId]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Tracking click...</p>
    </div>
  );
};

export default MagicButtonTrack;
