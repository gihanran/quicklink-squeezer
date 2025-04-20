
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useBioCardImageUpload } from '@/hooks/useBioCardImageUpload';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { slugify } from '@/utils/slugUtils';

interface BasicInfoSectionProps {
  title: string;
  setTitle: (title: string) => void;
  slug: string;
  setSlug: (slug: string) => void;
  description: string;
  setDescription: (description: string) => void;
  profileImageUrl: string;
  setProfileImageUrl: (url: string) => void;
  backgroundImageUrl?: string;
  setBackgroundImageUrl?: (url: string) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  title,
  setTitle,
  slug,
  setSlug,
  description,
  setDescription,
  profileImageUrl,
  setProfileImageUrl,
  backgroundImageUrl = '',
  setBackgroundImageUrl = () => {}
}) => {
  const { uploadImage, uploading } = useBioCardImageUpload();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if it's empty or was auto-generated before
    if (!slug || slugify(title) === slug) {
      setSlug(slugify(newTitle));
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = await uploadImage(file, 'profile');
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const imageUrl = await uploadImage(file, 'background');
    if (imageUrl) {
      setBackgroundImageUrl(imageUrl);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Basic Information</h3>
      
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-2 border-gray-200">
            <AvatarImage src={profileImageUrl} alt={title} />
            <AvatarFallback>{title.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              className="relative overflow-hidden"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" /> Upload Profile Image
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleProfileImageUpload}
                disabled={uploading}
              />
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Label>Background Image (Optional)</Label>
          <div className="mt-1 flex items-center">
            {backgroundImageUrl && (
              <div className="relative w-full h-20 mb-2 rounded overflow-hidden">
                <img 
                  src={backgroundImageUrl} 
                  alt="Background" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            className="relative overflow-hidden w-full mt-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" /> Upload Background Image
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleBackgroundImageUpload}
              disabled={uploading}
            />
          </Button>
        </div>
        
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="My Bio Card"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="my-bio-card"
            className="mt-1"
          />
          {slug && (
            <p className="text-xs text-gray-500 mt-1">
              Your bio card will be available at: /b/{slug}
            </p>
          )}
        </div>
        
        <div>
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief description of your bio card"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
