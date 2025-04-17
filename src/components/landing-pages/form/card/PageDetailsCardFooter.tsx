
import React from 'react';
import { CardFooter } from "@/components/ui/card";
import FormFooter from '../FormFooter';

interface PageDetailsCardFooterProps {
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  title: string;
  slug: string;
}

const PageDetailsCardFooter: React.FC<PageDetailsCardFooterProps> = ({
  onCancel,
  onSave,
  saving,
  title,
  slug
}) => {
  return (
    <CardFooter>
      <FormFooter 
        onCancel={onCancel} 
        onSave={onSave} 
        saving={saving} 
        disabled={!title || !slug} 
      />
    </CardFooter>
  );
};

export default PageDetailsCardFooter;
