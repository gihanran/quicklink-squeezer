
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Edit, Trash, ExternalLink, Share2 } from 'lucide-react';

interface BioCardActionsProps {
  slug: string;
  id: string;
  onDelete: (id: string) => void;
  onShare: (slug: string) => void;
}

const BioCardActions: React.FC<BioCardActionsProps> = ({ 
  slug, 
  id, 
  onDelete, 
  onShare 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        asChild
      >
        <Link to={`/biocard/edit/${slug}`}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Link>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="text-destructive border-destructive hover:bg-destructive/10"
        onClick={() => onDelete(id)}
      >
        <Trash className="h-4 w-4 mr-1" /> Delete
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        asChild
      >
        <a href={`/b/${slug}`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-1" /> View
        </a>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onShare(slug)}
      >
        <Share2 className="h-4 w-4 mr-1" /> Share
      </Button>
    </div>
  );
};

export default BioCardActions;
