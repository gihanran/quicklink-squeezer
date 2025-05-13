
import React from 'react';
import { ButtonColor } from '@/utils/unlocker/types';

interface SequenceIndicatorProps {
  userSequence: ButtonColor[];
  targetSequence: ButtonColor[];
}

const SequenceIndicator: React.FC<SequenceIndicatorProps> = ({ userSequence, targetSequence }) => {
  return (
    <div className="mt-8">
      <div className="flex justify-center space-x-2">
        {targetSequence.map((_, index) => (
          <div 
            key={index} 
            className={`w-3 h-3 rounded-full ${
              index < userSequence.length 
                ? userSequence[index] === targetSequence[index] 
                  ? 'bg-green-500' 
                  : 'bg-red-500' 
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SequenceIndicator;
