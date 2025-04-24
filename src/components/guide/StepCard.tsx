
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  showArrow?: boolean;
}

const StepCard = ({ step, title, description, showArrow = false }: StepCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-r from-brand-purple to-brand-blue w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {step}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {title}
            {showArrow && <ArrowRight className="inline-block ml-2 h-4 w-4" />}
          </h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default StepCard;
