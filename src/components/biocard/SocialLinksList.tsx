
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface SocialLinksListProps {
  links: any[];
  setLinks: React.Dispatch<React.SetStateAction<any[]>>;
  maxLinks: number;
  getSocialIcon?: (platform: string) => React.ReactNode;
}

const SocialLinksList: React.FC<SocialLinksListProps> = ({ 
  links, 
  setLinks, 
  maxLinks,
  getSocialIcon
}) => {
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  const handleAddLink = () => {
    if (!newPlatform || !newUrl || links.length >= maxLinks) return;
    
    const iconMap: Record<string, string> = {
      'facebook': 'facebook',
      'instagram': 'instagram',
      'twitter': 'twitter',
      'linkedin': 'linkedin',
    };
    
    setLinks([
      ...links, 
      { 
        platform: newPlatform, 
        url: newUrl, 
        icon: iconMap[newPlatform.toLowerCase()] || '' 
      }
    ]);
    
    setNewPlatform('');
    setNewUrl('');
  };
  
  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };
  
  const handleUrlChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index].url = value;
    setLinks(updatedLinks);
  };

  const renderSocialIcon = (platform: string) => {
    if (getSocialIcon) {
      return getSocialIcon(platform);
    }
    
    switch(platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4 mr-2" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 mr-2" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 mr-2" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-shrink-0 w-24">
              <div className="flex items-center">
                {renderSocialIcon(link.platform)}
                <span className="text-sm capitalize">{link.platform}</span>
              </div>
            </div>
            <Input
              value={link.url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              placeholder="https://example.com"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveLink(index)}
              className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {links.length === 0 && (
          <div className="text-center py-2 text-sm text-gray-500">
            No social links added yet
          </div>
        )}
      </div>
      
      {links.length < maxLinks && (
        <div className="flex gap-2">
          <Select value={newPlatform} onValueChange={setNewPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Twitter">Twitter</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
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
            onClick={handleAddLink}
            disabled={!newPlatform || !newUrl}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialLinksList;
