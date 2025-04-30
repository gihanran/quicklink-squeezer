
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { SOCIAL_PLATFORMS } from '../constants/socialPlatforms';
import { renderSocialIcon } from '../utils/socialIconRenderer';
import type { SocialLink } from '@/types/linkTypes';

interface AddSocialLinkFormProps {
  newPlatform: string;
  setNewPlatform: (platform: string) => void;
  newUrl: string;
  setNewUrl: (url: string) => void;
  onAddLink: () => void;
  disabled: boolean;
}

const AddSocialLinkForm: React.FC<AddSocialLinkFormProps> = ({
  newPlatform,
  setNewPlatform,
  newUrl,
  setNewUrl,
  onAddLink,
  disabled
}) => {
  return (
    <div className="flex gap-2">
      <Select value={newPlatform} onValueChange={setNewPlatform}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          {SOCIAL_PLATFORMS.map((platform) => (
            <SelectItem key={platform.value} value={platform.value}>
              <div className="flex items-center">
                {renderSocialIcon(platform.value)}
                {platform.label || platform.value}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        placeholder="https://..."
        className="flex-1"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAddLink}
        disabled={!newPlatform || !newUrl || disabled}
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        Add
      </Button>
    </div>
  );
};

export default AddSocialLinkForm;
