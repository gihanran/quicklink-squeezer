
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface BaseLinkProps {
  onDelete: () => void;
  children: React.ReactNode;
}

export const BaseLink: React.FC<BaseLinkProps> = ({ onDelete, children }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
