
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoveVertical, Trash2 } from 'lucide-react';
import { renderSocialIcon } from '../utils/socialIconRenderer';
import type { SocialLink } from '@/types/linkTypes';

interface SocialLinkItemProps {
  link: SocialLink;
  index: number;
  onUpdateLink: (id: string, updates: Partial<SocialLink>) => void;
  onRemoveLink: (id: string) => void;
  dragHandleProps: any;
  draggableProps: any;
  innerRef: any;
  getSocialIcon?: (platform: string) => React.ReactNode;
}

const SocialLinkItem: React.FC<SocialLinkItemProps> = ({
  link,
  index,
  onUpdateLink,
  onRemoveLink,
  dragHandleProps,
  draggableProps,
  innerRef,
  getSocialIcon
}) => {
  return (
    <div 
      ref={innerRef}
      {...draggableProps}
      className="flex items-center gap-2"
    >
      <div 
        className="cursor-move flex items-center justify-center p-1 hover:bg-gray-200 rounded"
        {...dragHandleProps}
      >
        <MoveVertical className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex-shrink-0 w-24">
        <div className="flex items-center">
          {renderSocialIcon(link.platform, getSocialIcon)}
          <span className="text-sm capitalize">{link.platform}</span>
        </div>
      </div>
      <Input
        value={link.url}
        onChange={(e) => onUpdateLink(link.id, { url: e.target.value })}
        placeholder="https://example.com"
        className="flex-1"
      />
      {link.clicks !== undefined && (
        <div className="text-sm text-gray-500 ml-2">
          {link.clicks} clicks
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemoveLink(link.id)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SocialLinkItem;
