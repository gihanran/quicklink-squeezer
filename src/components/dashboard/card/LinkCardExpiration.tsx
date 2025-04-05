
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface LinkCardExpirationProps {
  link: any;
  percentage: number;
  daysLeft: number;
}

const LinkCardExpiration: React.FC<LinkCardExpirationProps> = ({ 
  link, 
  percentage, 
  daysLeft 
}) => {
  if (!link.expiresAt) return null;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-1">
        <span>Link expiration</span>
        <span>{daysLeft} days left</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default LinkCardExpiration;
