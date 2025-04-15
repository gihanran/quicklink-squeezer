
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Plus, Trash2 } from "lucide-react";
import { SocialMediaLink } from "@/types/landingPage";
import { useToast } from "@/hooks/use-toast";

const socialMediaPlatforms = [
  { name: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
  { name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
  { name: 'Twitter', icon: <Twitter className="h-4 w-4" /> },
  { name: 'YouTube', icon: <Youtube className="h-4 w-4" /> }
];

interface SocialMediaLinksCardProps {
  socialLinks: SocialMediaLink[];
  onSocialLinksChange: (links: SocialMediaLink[]) => void;
}

export const SocialMediaLinksCard: React.FC<SocialMediaLinksCardProps> = ({ 
  socialLinks, 
  onSocialLinksChange 
}) => {
  const { toast } = useToast();
  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAddSocialLink = () => {
    if (!newPlatform || !newUrl) {
      toast({
        title: "Missing information",
        description: "Please select a platform and provide a URL",
        variant: "destructive"
      });
      return;
    }

    if (socialLinks.length >= 5) {
      toast({
        title: "Limit reached",
        description: "Maximum of 5 social media links allowed",
        variant: "destructive"
      });
      return;
    }

    const platform = socialMediaPlatforms.find(p => p.name === newPlatform);
    if (!platform) return;

    const newLink: SocialMediaLink = {
      platform: newPlatform,
      url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      icon: newPlatform.toLowerCase()
    };

    onSocialLinksChange([...socialLinks, newLink]);
    setNewPlatform('');
    setNewUrl('');
  };

  const handleRemoveSocialLink = (index: number) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    onSocialLinksChange(updatedLinks);
  };

  const getIconForPlatform = (platform: string) => {
    const socialPlatform = socialMediaPlatforms.find(p => p.name === platform);
    return socialPlatform?.icon || null;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-12 flex justify-center">
                  {getIconForPlatform(link.platform)}
                </div>
                <Input 
                  value={link.url} 
                  onChange={e => {
                    const updatedLinks = [...socialLinks];
                    updatedLinks[index].url = e.target.value;
                    onSocialLinksChange(updatedLinks);
                  }} 
                  className="flex-1" 
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveSocialLink(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          {socialLinks.length < 5 && (
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={newPlatform} onValueChange={setNewPlatform}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {socialMediaPlatforms.map((platform) => (
                      <SelectItem key={platform.name} value={platform.name}>
                        <div className="flex items-center gap-2">
                          {platform.icon}
                          <span>{platform.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url" 
                  placeholder="yourprofile" 
                  value={newUrl} 
                  onChange={e => setNewUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleAddSocialLink}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          )}
          <p className="text-sm text-muted-foreground">Add up to 5 social media links to display on your bio card.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaLinksCard;
