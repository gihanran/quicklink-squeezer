
import React from 'react';
import StepCard from './StepCard';

interface Step {
  step: number;
  title: string;
  description: string;
}

interface GuideSectionProps {
  title: string;
  steps: Step[];
  totalSteps: number;
}

const GuideSection = ({ title, steps, totalSteps }: GuideSectionProps) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="space-y-6">
        {steps.map((item) => (
          <StepCard
            key={item.step}
            {...item}
            showArrow={item.step < totalSteps}
          />
        ))}
      </div>
    </section>
  );
};

export default GuideSection;
