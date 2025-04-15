
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export interface FormFooterProps {
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  disabled?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ 
  onCancel, 
  onSave, 
  saving, 
  disabled = false 
}) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={saving}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button
        onClick={onSave}
        disabled={disabled || saving}
      >
        {saving ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save
          </>
        )}
      </Button>
    </div>
  );
};

export default FormFooter;
