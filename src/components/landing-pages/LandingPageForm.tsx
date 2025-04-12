
import React, { useState } from 'react';
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
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { LandingPage, LandingPageLink } from "@/types/landingPage";

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
  const [saving, setSaving] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const [localLinks, setLocalLinks] = useState<LandingPageLink[]>(links);
  const isEditing = !!page?.id;

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
        published
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

  const handleAddLink = async () => {
    if (!linkTitle || !linkUrl) {
      return;
    }

    setAddingLink(true);
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

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <CardDescription>
            Configure how your landing page will appear to visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of what this page is about"
              rows={3}
            />
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
              Add links that will appear on your landing page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <Label htmlFor="linkTitle">Link Title</Label>
                <Input
                  id="linkTitle"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  placeholder="Instagram"
                />
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LandingPageForm;
