
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  Github,
  Twitch,
  Globe
} from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, prefix: 'https://instagram.com/' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, prefix: 'https://facebook.com/' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, prefix: 'https://twitter.com/' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, prefix: 'https://linkedin.com/in/' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, prefix: 'https://youtube.com/' },
  { id: 'github', name: 'GitHub', icon: Github, prefix: 'https://github.com/' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, prefix: 'https://twitch.tv/' },
  { id: 'website', name: 'Website', icon: Globe, prefix: 'https://' }
];

interface SocialLinksListProps {
  links: any[];
  setLinks: (links: any[]) => void;
  maxLinks: number;
}

const SocialLinksList: React.FC<SocialLinksListProps> = ({ links, setLinks, maxLinks }) => {
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');

  const addSocialLink = () => {
    if (links.length >= maxLinks) {
      return;
    }
    
    if (!platform || !username) {
      return;
    }
    
    const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.id === platform);
    if (!selectedPlatform) return;
    
    const url = username.startsWith('http') 
      ? username 
      : `${selectedPlatform.prefix}${username}`;
    
    setLinks([
      ...links, 
      { 
        id: Date.now(),
        platform,
        url,
        icon: selectedPlatform.id
      }
    ]);
    
    setPlatform('');
    setUsername('');
  };

  const removeSocialLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    const Icon = platform ? platform.icon : Globe;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-4 space-y-4">
        <div>
          <Label htmlFor="socialPlatform">Platform</Label>
          <select
            id="socialPlatform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Select platform...</option>
            {SOCIAL_PLATFORMS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <Label htmlFor="socialUsername">
            {platform && SOCIAL_PLATFORMS.find(p => p.id === platform)?.name === 'Website' 
              ? 'URL' 
              : 'Username or Full URL'}
          </Label>
          <Input
            id="socialUsername"
            placeholder={platform ? `Username or full URL` : 'Select a platform first'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1"
            disabled={!platform}
          />
          {platform && (
            <p className="text-xs text-gray-500 mt-1">
              {username.startsWith('http') 
                ? 'Using custom URL' 
                : `Will be linked to: ${SOCIAL_PLATFORMS.find(p => p.id === platform)?.prefix}${username}`}
            </p>
          )}
        </div>
        
        <Button
          type="button"
          onClick={addSocialLink}
          disabled={!platform || !username || links.length >= maxLinks}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Social Link
        </Button>
      </div>
      
      {links.length > 0 ? (
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="flex items-center gap-3 border rounded-md p-3 bg-gray-50">
              <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                {getPlatformIcon(link.platform)}
              </div>
              <div className="flex-grow">
                <div className="font-medium capitalize">
                  {SOCIAL_PLATFORMS.find(p => p.id === link.platform)?.name || link.platform}
                </div>
                <div className="text-xs text-gray-500 truncate">{link.url}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSocialLink(link.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-gray-500">No social links added yet</p>
        </div>
      )}
      
      {links.length >= maxLinks && (
        <p className="text-amber-600 text-sm">
          Maximum number of social links reached ({maxLinks})
        </p>
      )}
    </div>
  );
};

export default SocialLinksList;
