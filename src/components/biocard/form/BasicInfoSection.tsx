
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { useBioCardImageUpload } from '@/hooks/useBioCardImageUpload';

interface BasicInfoSectionProps {
  title: string;
  setTitle: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  profileImageUrl: string;
  setProfileImageUrl: (value: string) => void;
}

export const BasicInfoSection = ({
  title,
  setTitle,
  slug,
  setSlug,
  description,
  setDescription,
  profileImageUrl,
  setProfileImageUrl
}: BasicInfoSectionProps) => {
  const { uploadImage, uploading } = useBioCardImageUpload();

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 250) {
      setDescription(text);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const imageUrl = await uploadImage(file, 'profile');
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  return (
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
          <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
              disabled={uploading}
            />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
