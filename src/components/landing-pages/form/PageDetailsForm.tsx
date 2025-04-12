import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LandingPage } from "@/types/landingPage";

interface PageDetailsFormProps {
  page: Partial<LandingPage> | null;
  title: string;
  setTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  setDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  slug: string;
  setSlug: (value: string) => void;
  published: boolean;
  setPublished: (value: boolean) => void;
  profileImageUrl: string;
  themeColor: string;
  setThemeColor: (value: string) => void;
  uploading: boolean;
  error: string | null;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const themeColors = [
  { name: 'Purple', value: '#9b87f5' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Teal', value: '#14b8a6' },
];

const PageDetailsForm: React.FC<PageDetailsFormProps> = ({
  page,
  title,
  description,
  slug,
  published,
  profileImageUrl,
  themeColor,
  setSlug,
  setPublished,
  setThemeColor,
  uploading,
  handleProfileImageUpload,
  handleTitleChange,
  handleDescriptionChange,
}) => {
  // Handle slug change directly since it's a simple string value
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-gray-200">
              <AvatarImage src={profileImageUrl || ""} alt="Profile" />
              <AvatarFallback>
                {title ? title.charAt(0).toUpperCase() : "LP"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <div className="relative">
                <Button
                  type="button"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 text-white" />
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          placeholder="My Landing Page"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Max 250 characters)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="A brief description of what this page is about"
          rows={3}
          maxLength={250}
        />
        <p className="text-xs text-gray-500 text-right">
          {description?.length || 0}/250
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <div className="flex items-center">
          <span className="text-gray-500 mr-1">/p/</span>
          <Input
            id="slug"
            value={slug}
            onChange={handleSlugChange}
            placeholder="my-landing-page"
          />
        </div>
        <p className="text-sm text-gray-500">
          This will be the URL of your landing page: /p/{slug || 'my-landing-page'}
        </p>
      </div>

      <div className="space-y-2 pt-4">
        <Label>Theme Color</Label>
        <div className="flex flex-wrap gap-2">
          {themeColors.map(color => (
            <button
              key={color.value}
              className={`w-8 h-8 rounded-full border-2 ${themeColor === color.value ? 'border-black' : 'border-transparent'}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setThemeColor(color.value)}
              type="button"
              aria-label={`Select ${color.name} theme`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Switch
          id="published"
          checked={published}
          onCheckedChange={setPublished}
        />
        <Label htmlFor="published">Publish this page</Label>
      </div>
    </div>
  );
};

export default PageDetailsForm;
