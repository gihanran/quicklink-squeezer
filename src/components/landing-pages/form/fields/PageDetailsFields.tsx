
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface PageDetailsFieldsProps {
  title: string;
  description: string;
  slug: string;
  published: boolean;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPublished: (value: boolean) => void;
}

const PageDetailsFields: React.FC<PageDetailsFieldsProps> = ({
  title,
  description,
  slug,
  published,
  handleTitleChange,
  handleDescriptionChange,
  handleSlugChange,
  setPublished
}) => {
  return (
    <div className="space-y-4">
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

export default PageDetailsFields;
