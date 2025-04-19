
import React from 'react';
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: "Paste your link",
    description: "Enter your long URL into our shortener"
  },
  {
    number: 2,
    title: "Create short URL",
    description: "Click the button to generate your shortened link"
  },
  {
    number: 3,
    title: "Share and track",
    description: "Copy and share your short link anywhere"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold">How It Works</h2>
        <p className="mt-2 text-gray-600">Three simple steps to create and share shortened links</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="relative">
            <div className="bg-white rounded-xl p-6 h-full shadow-md border border-gray-100">
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue h-10 w-10 rounded-full flex items-center justify-center text-white font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold mb-4">Why choose our URL shortener?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "No registration required for basic shortening",
            "Detailed analytics for registered users",
            "Custom short links for premium users",
            "API access for developers",
            "GDPR compliant and secure",
            "99.9% uptime guarantee"
          ].map((feature, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle size={18} className="text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
