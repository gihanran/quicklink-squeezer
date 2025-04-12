
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Upload, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { supabase } from "@/integrations/supabase/client";
import { uploadProfileImage } from "@/services/landingPageService";
import { Alert } from "@/components/ui/alert";

interface LandingPageFormProps {
  page: Partial<LandingPage> | null;
  links: LandingPageLink[];
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLink: (id: string, updates: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onDeleteLink: (id: string) => Promise<boolean>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
  onBack: () => void;
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

const LandingPageForm: React.FC<LandingPageFormProps> = ({
  page,
  links,
  onSave,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onUpdateLinkOrder,
  onBack
}) => {
  const [title, setTitle] = useState(page?.title || '');
  const [description, setDescription] = useState(page?.description || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [published, setPublished] = useState(page?.published || false);
  const [profileImageUrl, setProfileImageUrl] = useState(page?.profile_image_url || '');
  const [themeColor, setThemeColor] = useState(page?.theme_color || themeColors[0].value);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const [localLinks, setLocalLinks] = useState<LandingPageLink[]>(links);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!page?.id;

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  // Generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 250) {
      setDescription(value);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      setError(null);
      
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to upload an image');
      
      const url = await uploadProfileImage(files[0], user.id);
      setProfileImageUrl(url);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title) {
      return;
    }

    setSaving(true);
    try {
      const updates: Partial<LandingPage> = {
        title,
        description: description || null,
        slug,
        published,
        profile_image_url: profileImageUrl || null,
        theme_color: themeColor
      };

      if (!isEditing) {
        await onSave(updates);
      } else {
        await onSave({ ...updates, id: page!.id });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLinkTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 140) {
      setLinkTitle(value);
    }
  };

  const handleAddLink = async () => {
    if (!linkTitle || !linkUrl) {
      return;
    }
    
    if (localLinks.length >= 5) {
      setError('Maximum of 5 links allowed per landing page');
      return;
    }

    setAddingLink(true);
    setError(null);
    
    try {
      const newLink = await onAddLink({
        landing_page_id: page!.id,
        title: linkTitle,
        url: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`,
        display_order: localLinks.length
      });

      if (newLink) {
        setLocalLinks([...localLinks, newLink]);
        setLinkTitle('');
        setLinkUrl('');
      }
    } catch (error: any) {
      console.error('Error adding link:', error);
      setError(error.message);
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    const success = await onDeleteLink(id);
    if (success) {
      setLocalLinks(localLinks.filter(link => link.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Landing Page' : 'Create Landing Page'}
        </h2>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <CardDescription>
            Configure how your landing page will appear to visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                onChange={(e) => setSlug(e.target.value)}
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
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || !title || !slug}
            className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Page'}
          </Button>
        </CardFooter>
      </Card>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
            <CardDescription>
              Add links that will appear on your landing page (maximum 5).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {localLinks.length < 5 && (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <Label htmlFor="linkTitle">Link Title (Max 140 characters)</Label>
                  <Input
                    id="linkTitle"
                    value={linkTitle}
                    onChange={handleLinkTitleChange}
                    placeholder="Instagram"
                    maxLength={140}
                  />
                  <p className="text-xs text-gray-500 text-right mt-1">
                    {linkTitle.length}/140
                  </p>
                </div>
                <div className="col-span-5">
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  <Button 
                    onClick={handleAddLink}
                    disabled={addingLink || !linkTitle || !linkUrl}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {localLinks.length === 0 ? (
                <div className="text-center py-4 border rounded-md bg-gray-50">
                  <p className="text-gray-500">No links added yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {localLinks.map((link) => (
                    <div 
                      key={link.id} 
                      className="flex items-center justify-between p-3 border rounded-md bg-background"
                    >
                      <div className="flex items-center">
                        <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium">{link.title}</p>
                          <p className="text-sm text-gray-500 truncate">{link.url}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {localLinks.length >= 5 && (
                <p className="text-sm text-amber-600 mt-2">
                  Maximum limit of 5 links reached.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LandingPageForm;
