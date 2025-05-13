
import React, { useState } from 'react';
import { UrlUnlocker, ButtonColor } from '@/utils/unlocker/types';
import { trackUnlockerSuccess } from '@/utils/unlocker/unlockersUtil';
import SequenceButtons from './SequenceButtons';
import SequenceIndicator from './SequenceIndicator';
import SuccessState from './SuccessState';

interface UnlockContentProps {
  unlocker: UrlUnlocker;
  onSequenceChange?: (sequenceLength: number) => void;
}

const UnlockContent: React.FC<UnlockContentProps> = ({ unlocker, onSequenceChange }) => {
  const [userSequence, setUserSequence] = useState<ButtonColor[]>([]);
  const [unlocked, setUnlocked] = useState<boolean>(false);

  const handleButtonClick = (color: ButtonColor) => {
    if (unlocked) return;
    
    const newSequence = [...userSequence, color];
    setUserSequence(newSequence);
    
    // Notify parent of sequence change if callback provided
    if (onSequenceChange) {
      onSequenceChange(newSequence.length);
    }
    
    // Check if the sequence matches so far
    const currentStep = userSequence.length;
    if (unlocker.sequence[currentStep] !== color) {
      // Incorrect sequence, reset
      setUserSequence([]);
      if (onSequenceChange) {
        onSequenceChange(0);
      }
      return;
    }
    
    // Check if sequence is complete
    if (newSequence.length === unlocker.sequence.length) {
      setUnlocked(true);
      trackUnlockerSuccess(unlocker.id);
    }
  };

  return (
    <>
      {!unlocked ? (
        <div className="space-y-6">
          <SequenceButtons 
            onClick={handleButtonClick} 
            disabled={unlocked} 
          />
          
          <SequenceIndicator 
            userSequence={userSequence} 
            targetSequence={unlocker.sequence} 
          />
        </div>
      ) : (
        <SuccessState destinationUrl={unlocker.destinationUrl} />
      )}
    </>
  );
};

export default UnlockContent;
