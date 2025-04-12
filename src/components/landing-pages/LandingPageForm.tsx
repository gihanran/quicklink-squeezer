
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { supabase } from "@/integrations/supabase/client";
import { uploadProfileImage } from "@/services/landingPageService";

// Import our new components
import FormHeader from "./form/FormHeader";
import PageDetailsForm from "./form/PageDetailsForm";
import LinksForm from "./form/LinksForm";
import FormFooter from "./form/FormFooter";

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
  // Form state
  const [title, setTitle] = useState(page?.title || '');
  const [description, setDescription] = useState(page?.description || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [published, setPublished] = useState(page?.published || false);
  const [profileImageUrl, setProfileImageUrl] = useState(page?.profile_image_url || '');
  const [themeColor, setThemeColor] = useState(page?.theme_color || '#9b87f5');
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [addingLink, setAddingLink] = useState(false);
  const [localLinks, setLocalLinks] = useState<LandingPageLink[]>(links);
  
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

  const handleAddLink = async (link: { title: string, url: string }) => {
    if (!link.title || !link.url || !page?.id) {
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
        landing_page_id: page.id,
        title: link.title,
        url: link.url.startsWith('http') ? link.url : `https://${link.url}`,
        display_order: localLinks.length
      });

      if (newLink) {
        setLocalLinks([...localLinks, newLink]);
      }
    } catch (error: any) {
      console.error('Error adding link:', error);
      setError(error.message);
    } finally {
      setAddingLink(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader 
        isEditing={isEditing} 
        error={error} 
        onBack={onBack} 
      />

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <CardDescription>
            Configure how your landing page will appear to visitors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PageDetailsForm
            page={page}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            slug={slug}
            setSlug={setSlug}
            published={published}
            setPublished={setPublished}
            profileImageUrl={profileImageUrl}
            setProfileImageUrl={setProfileImageUrl}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
            uploading={uploading}
            error={error}
            handleProfileImageUpload={handleProfileImageUpload}
            handleTitleChange={handleTitleChange}
            handleDescriptionChange={handleDescriptionChange}
          />
        </CardContent>
        <CardFooter>
          <FormFooter 
            onCancel={onBack} 
            onSave={handleSave} 
            saving={saving} 
            disabled={!title || !slug} 
          />
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
          <CardContent>
            <LinksForm 
              links={localLinks}
              onAddLink={handleAddLink}
              onDeleteLink={onDeleteLink}
              error={error}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LandingPageForm;
