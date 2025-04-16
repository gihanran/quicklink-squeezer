
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const ErrorState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-gray-600 mb-8">The landing page you're looking for doesn't exist or isn't published.</p>
      <Button onClick={() => navigate('/')}>Return Home</Button>
    </div>
  );
};

export default ErrorState;
