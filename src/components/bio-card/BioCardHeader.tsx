
import React from 'react';

const BioCardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-8">
      <div>
        <h1 className="text-3xl font-bold">Bio Card</h1>
        <p className="text-gray-600">Create and manage simple bio cards with multiple links.</p>
      </div>
    </div>
  );
};

export default BioCardHeader;
