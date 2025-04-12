
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormHeaderProps {
  isEditing: boolean;
  error: string | null;
  onBack: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEditing, error, onBack }) => {
  return (
    <>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Landing Page' : 'Create Landing Page'}
        </h2>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}
    </>
  );
};

export default FormHeader;
