
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useAuthState } from '@/hooks/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { HexColorPicker } from 'react-colorful';
import LinksList from './LinksList';
import SocialLinksList from './SocialLinksList';
import type { BioCard } from '@/types/bioCardTypes';

interface BioCardFormProps {
  onClose: () => void;
  onSave: () => void;
  initialData?: BioCard;
}

const BioCardForm: React.FC<BioCardFormProps> = ({ 
  onClose, 
  onSave,
  initialData
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [bgColor, setBgColor] = useState(initialData?.bg_color || '#ffffff');
  const [buttonColor, setButtonColor] = useState(initialData?.button_color || '#6366f1');
  const [buttonStyle, setButtonStyle] = useState(initialData?.button_style || 'rounded');
  const [saving, setSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(initialData?.profile_image_url || '');
  const [links, setLinks] = useState<any[]>(initialData?.links || []);
  const [socialLinks, setSocialLinks] = useState<any[]>(initialData?.social_links || []);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);

  const { user } = useAuthState();
  const { toast } = useToast();

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 250) {
      setDescription(text);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(value);
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}/bio_cards/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('bio_cards')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from('bio_cards')
        .getPublicUrl(fileName);

      setProfileImageUrl(data.publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'Your profile image has been uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred while uploading the image',
        variant: 'destructive'
      });
    }
  };

  const handleSave = async () => {
    if (!title) {
      toast({
        title: 'Missing title',
        description: 'Please enter a title for your bio card',
        variant: 'destructive'
      });
      return;
    }

    if (!slug) {
      toast({
        title: 'Missing slug',
        description: 'Please enter a slug for your bio card',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaving(true);

      // Check if slug is already taken
      if (!initialData) {
        const { data: existingCard } = await (supabase as any)
          .from('bio_cards')
          .select('id')
          .eq('slug', slug)
          .single();

        if (existingCard) {
          toast({
            title: 'Slug already taken',
            description: 'Please choose a different slug',
            variant: 'destructive'
          });
          setSaving(false);
          return;
        }
      }

      // Create or update bio card
      const bioCardData = {
        title,
        slug,
        description,
        bg_color: bgColor,
        button_color: buttonColor,
        button_style: buttonStyle,
        profile_image_url: profileImageUrl,
        user_id: user!.id
      };

      let cardId;

      if (initialData) {
        const { error } = await (supabase as any)
          .from('bio_cards')
          .update(bioCardData)
          .eq('id', initialData.id);

        if (error) throw error;
        cardId = initialData.id;
      } else {
        const { data, error } = await (supabase as any)
          .from('bio_cards')
          .insert([bioCardData])
          .select();

        if (error) throw error;
        cardId = data[0].id;
      }

      // Save links
      if (initialData) {
        // Delete existing links
        await (supabase as any)
          .from('bio_card_links')
          .delete()
          .eq('bio_card_id', initialData.id);
      }

      // Add new links
      if (links.length > 0) {
        const linksToInsert = links.map((link: any) => ({
          bio_card_id: cardId,
          title: link.title,
          url: link.url,
          description: link.description,
          icon: link.icon
        }));

        const { error: linksError } = await (supabase as any)
          .from('bio_card_links')
          .insert(linksToInsert);

        if (linksError) throw linksError;
      }

      // Add social links
      if (socialLinks.length > 0) {
        const socialLinksToInsert = socialLinks.map((link: any) => ({
          bio_card_id: cardId,
          platform: link.platform,
          url: link.url,
          icon: link.icon
        }));

        const { error: socialLinksError } = await (supabase as any)
          .from('bio_card_social_links')
          .insert(socialLinksToInsert);

        if (socialLinksError) throw socialLinksError;
      }

      toast({
        title: initialData ? 'Bio card updated' : 'Bio card created',
        description: initialData 
          ? 'Your bio card has been updated successfully' 
          : 'Your new bio card has been created'
      });

      onSave();
    } catch (error: any) {
      console.error('Error saving bio card:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save bio card',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{initialData ? 'Edit Bio Card' : 'Create New Bio Card'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="My Bio Card"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="slug">
                  Slug <span className="text-xs text-gray-500">(appears in URL)</span>
                </Label>
                <Input
                  id="slug"
                  placeholder="my-bio-card"
                  value={slug}
                  onChange={handleSlugChange}
                  className="mt-1"
                />
                {slug && (
                  <p className="text-xs text-gray-500 mt-1">
                    Your bio card will be available at: /b/{slug}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">
                  Description <span className="text-xs text-gray-500">({description.length}/250)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Short description about yourself"
                  value={description}
                  onChange={handleDescriptionChange}
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="profileImage">Profile Image</Label>
                <div className="flex items-center gap-4 mt-1">
                  {profileImageUrl && (
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                      <img 
                        src={profileImageUrl} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Style Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Background Color</Label>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      onClick={() => setColorPickerOpen(colorPickerOpen === 'bg' ? null : 'bg')}
                      className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer"
                      style={{ backgroundColor: bgColor }}
                    >
                      <span style={{ color: getContrastColor(bgColor) }}>{bgColor}</span>
                      <div
                        className="h-6 w-6 rounded border border-gray-300"
                        style={{ backgroundColor: bgColor }}
                      />
                    </button>
                    {colorPickerOpen === 'bg' && (
                      <div className="absolute z-10 mt-2">
                        <HexColorPicker color={bgColor} onChange={setBgColor} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Button Color</Label>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      onClick={() => setColorPickerOpen(colorPickerOpen === 'button' ? null : 'button')}
                      className="w-full h-10 border border-gray-300 rounded-md flex items-center justify-between px-3 cursor-pointer"
                      style={{ backgroundColor: buttonColor }}
                    >
                      <span style={{ color: getContrastColor(buttonColor) }}>{buttonColor}</span>
                      <div
                        className="h-6 w-6 rounded border border-gray-300"
                        style={{ backgroundColor: buttonColor }}
                      />
                    </button>
                    {colorPickerOpen === 'button' && (
                      <div className="absolute z-10 mt-2">
                        <HexColorPicker color={buttonColor} onChange={setButtonColor} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label>Button Style</Label>
                  <div className="grid grid-cols-3 gap-3 mt-1">
                    {['rounded', 'pill', 'square'].map(style => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setButtonStyle(style)}
                        className={`h-10 border ${
                          buttonStyle === style
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-gray-300'
                        } flex items-center justify-center text-sm capitalize transition-all`}
                        style={{
                          backgroundColor: buttonColor,
                          color: getContrastColor(buttonColor),
                          borderRadius: 
                            style === 'rounded' ? '0.375rem' : 
                            style === 'pill' ? '9999px' : 
                            '0px'
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Links (Maximum 7)</h3>
            <LinksList 
              links={links} 
              setLinks={setLinks} 
              maxLinks={7} 
            />
            
            <h3 className="text-lg font-medium mb-3 mt-6">Social Media (Maximum 5)</h3>
            <SocialLinksList 
              links={socialLinks} 
              setLinks={setSocialLinks}
              maxLinks={5}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : initialData ? 'Update Bio Card' : 'Create Bio Card'}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string) {
  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export default BioCardForm;
