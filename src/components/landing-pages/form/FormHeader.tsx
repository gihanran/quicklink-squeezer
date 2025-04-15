
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface FormHeaderProps {
  isEditing: boolean;
  error: string | null;
  onBack: () => void;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEditing, error, onBack }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-3xl font-bold">
            {isEditing ? 'Edit Landing Page' : 'Create Landing Page'}
          </h2>
        </div>
        <Button
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to list
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FormHeader;
