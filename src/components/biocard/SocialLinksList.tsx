
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageSquare } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { BaseLink } from './base/BaseLink';
import { useLinkManager } from '@/hooks/biocard/useLinkManager';
import type { SocialLink, BaseLinkListProps } from '@/types/linkTypes';

const SOCIAL_PLATFORMS = [
  { value: 'Facebook', icon: <Facebook className="h-4 w-4 mr-2" /> },
  { value: 'YouTube', icon: <Youtube className="h-4 w-4 mr-2" /> },
  { value: 'Instagram', icon: <Instagram className="h-4 w-4 mr-2" /> },
  { value: 'Twitter', icon: <Twitter className="h-4 w-4 mr-2" /> },
  { value: 'LinkedIn', icon: <Linkedin className="h-4 w-4 mr-2" /> },
  { value: 'Discord', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'WeChat', label: 'WeChat' },
  { value: 'Telegram', label: 'Telegram' },
  { value: 'Snapchat', label: 'Snapchat' },
  { value: 'Douyin', label: 'Douyin (Chinese TikTok)' },
  { value: 'Pinterest', label: 'Pinterest' },
  { value: 'Reddit', label: 'Reddit' },
  { value: 'Quora', label: 'Quora' },
  { value: 'Weibo', label: 'Sina Weibo' },
  { value: 'Threads', label: 'Threads' },
  { value: 'LINE', label: 'LINE' },
  { value: 'Tumblr', label: 'Tumblr' },
  { value: 'Twitch', label: 'Twitch' },
  { value: 'Viber', label: 'Viber' },
  { value: 'Clubhouse', label: 'Clubhouse' },
  { value: 'BeReal', label: 'BeReal' },
  { value: 'QQ', label: 'QQ' },
];

interface SocialLinksListProps extends BaseLinkListProps<SocialLink> {
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
  const { addLink, removeLink, updateLink } = useLinkManager(links, setLinks, maxLinks);

  const handleAddLink = () => {
    if (!newPlatform || !newUrl) return;
    
    const iconMap: Record<string, string> = {
      'facebook': 'facebook',
      'instagram': 'instagram',
      'twitter': 'twitter',
      'linkedin': 'linkedin',
      'youtube': 'youtube',
    };
    
    addLink({ 
      platform: newPlatform, 
      url: newUrl, 
      icon: iconMap[newPlatform.toLowerCase()] || '',
      id: Date.now().toString()
    });
    
    setNewPlatform('');
    setNewUrl('');
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
      case 'youtube':
        return <Youtube className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 space-y-3">
        {links.map((link) => (
          <BaseLink key={link.id} onDelete={() => removeLink(link.id)}>
            <div className="flex-shrink-0 w-24">
              <div className="flex items-center">
                {renderSocialIcon(link.platform)}
                <span className="text-sm capitalize">{link.platform}</span>
              </div>
            </div>
            <Input
              value={link.url}
              onChange={(e) => updateLink(link.id, { url: e.target.value })}
              placeholder="https://example.com"
              className="flex-1"
            />
            {link.clicks !== undefined && (
              <div className="text-sm text-gray-500 ml-2">
                {link.clicks} clicks
              </div>
            )}
          </BaseLink>
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
              {SOCIAL_PLATFORMS.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  <div className="flex items-center">
                    {platform.icon || null}
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

