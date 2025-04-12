
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface FormFooterProps {
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  disabled: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ onCancel, onSave, saving, disabled }) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button 
        onClick={onSave} 
        disabled={saving || disabled}
        className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Page'}
      </Button>
    </div>
  );
};

export default FormFooter;
