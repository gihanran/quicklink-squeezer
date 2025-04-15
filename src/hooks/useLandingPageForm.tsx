
import { useState, useEffect } from 'react';
import { LandingPage, LandingPageLink, SocialMediaLink } from "@/types/landingPage";
import { useToast } from "@/hooks/use-toast";
import { useImageUpload } from './useImageUpload';
import { useFormUtils } from './useFormUtils';
import { useLinksManagement } from './useLinksManagement';

type ButtonStyleType = 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';

interface UseLandingPageFormProps {
  page: Partial<LandingPage> | null;
  links: LandingPageLink[];
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
}

export const useLandingPageForm = ({
  page,
  links,
  onSave,
  onAddLink,
  onUpdateLinkOrder
}: UseLandingPageFormProps) => {
  // Form state
  const [title, setTitle] = useState(page?.title || '');
  const [description, setDescription] = useState(page?.description || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [published, setPublished] = useState(page?.published || false);
  const [profileImageUrl, setProfileImageUrl] = useState(page?.profile_image_url || '');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(page?.background_image_url || null);
  const [themeColor, setThemeColor] = useState(page?.theme_color || '#9b87f5');
  const [buttonStyle, setButtonStyle] = useState<ButtonStyleType>(
    (page?.button_style as ButtonStyleType) || 'default'
  );
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(page?.social_links || []);
  
  // UI state
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Custom hooks
  const { uploading, error, uploadImage, setError } = useImageUpload();
  const { generateSlug, validateForm } = useFormUtils();
  const { localLinks, handleAddLink, handleReorderLinks } = useLinksManagement({
    links,
    onAddLink,
    onUpdateLinkOrder
  });
  
  const isEditing = !!page?.id;

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
    const imageUrl = await uploadImage(e);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  const handleBackgroundImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadImage(e, 'backgrounds');
    if (imageUrl) {
      setBackgroundImageUrl(imageUrl);
    }
  };

  const handleSave = async () => {
    if (!validateForm(title, slug, isEditing)) {
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
        background_image_url: backgroundImageUrl,
        theme_color: themeColor,
        button_style: buttonStyle,
        social_links: socialLinks
      };

      if (!isEditing) {
        await onSave(updates);
        toast({
          title: "Page created",
          description: "Your landing page has been created successfully"
        });
      } else {
        await onSave({ ...updates, id: page!.id });
        toast({
          title: "Page updated",
          description: "Your landing page has been updated successfully"
        });
      }
    } catch (error: any) {
      console.error('Error saving landing page:', error);
      setError(error.message);
      toast({
        title: "Save failed",
        description: error.message || "An error occurred while saving the landing page",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addPageLink = async (link: { title: string, url: string }) => {
    if (page?.id) {
      return handleAddLink(link, page.id);
    }
  };

  return {
    // Form state
    title,
    description,
    slug,
    published,
    profileImageUrl,
    backgroundImageUrl,
    themeColor,
    buttonStyle,
    socialLinks,
    // UI state
    saving,
    uploading,
    error,
    localLinks,
    isEditing,
    // Handlers
    setTitle: handleTitleChange,
    setDescription: handleDescriptionChange,
    setSlug,
    setPublished,
    setThemeColor,
    setButtonStyle,
    setSocialLinks,
    setBackgroundImageUrl,
    handleProfileImageUpload,
    handleBackgroundImageUpload,
    handleSave,
    handleAddLink: addPageLink,
    handleReorderLinks
  };
};
