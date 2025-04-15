
import { useState, useEffect } from 'react';
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { useToast } from "@/hooks/use-toast";
import { useProfileImageUpload } from './useProfileImageUpload';
import { useFormValidation } from './useFormValidation';
import { generateSlugFromTitle } from '@/utils/slugUtils';

interface UseBioCardFormProps {
  page: Partial<LandingPage> | null;
  links: LandingPageLink[];
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
}

export const useBioCardForm = ({
  page,
  links,
  onSave,
  onAddLink,
  onUpdateLinkOrder
}: UseBioCardFormProps) => {
  // Form state
  const [title, setTitle] = useState(page?.title || '');
  const [description, setDescription] = useState(page?.description || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [published, setPublished] = useState(page?.published || false);
  const [profileImageUrl, setProfileImageUrl] = useState(page?.profile_image_url || '');
  const [themeColor, setThemeColor] = useState(page?.theme_color || '#9b87f5');
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [localLinks, setLocalLinks] = useState<LandingPageLink[]>(links);
  
  const { toast } = useToast();
  const isEditing = !!page?.id;
  const { uploading, error: uploadError, uploadProfileImage } = useProfileImageUpload();
  const { error, setError, validatePageSave, validateLinkAdd } = useFormValidation();

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(generateSlugFromTitle(newTitle));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 250) {
      setDescription(value);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageUrl = await uploadProfileImage(e);
    if (imageUrl) {
      setProfileImageUrl(imageUrl);
    }
  };

  const handleSave = async () => {
    if (!validatePageSave(title)) return;

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
        toast({
          title: "Page created",
          description: "Your bio card has been created successfully"
        });
      } else {
        await onSave({ ...updates, id: page!.id });
        toast({
          title: "Page updated",
          description: "Your bio card has been updated successfully"
        });
      }
    } catch (error: any) {
      console.error('Error saving bio card:', error);
      setError(error.message);
      toast({
        title: "Save failed",
        description: error.message || "An error occurred while saving the bio card",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddLink = async (link: { title: string, url: string }) => {
    if (!validateLinkAdd(link, page?.id, localLinks)) return;
    
    try {
      const newLink = await onAddLink({
        landing_page_id: page!.id,
        title: link.title,
        url: link.url.startsWith('http') ? link.url : `https://${link.url}`,
        display_order: localLinks.length
      });

      if (newLink) {
        setLocalLinks([...localLinks, newLink]);
        toast({
          title: "Link added",
          description: "Your link has been added successfully"
        });
      }
    } catch (error: any) {
      console.error('Error adding link:', error);
      setError(error.message);
      toast({
        title: "Failed to add link",
        description: error.message || "An error occurred while adding the link",
        variant: "destructive"
      });
    }
  };

  const handleReorderLinks = async (reorderedLinks: LandingPageLink[]) => {
    try {
      setError(null);
      await onUpdateLinkOrder(reorderedLinks);
      setLocalLinks(reorderedLinks);
      toast({
        title: "Links reordered",
        description: "Your links have been reordered successfully"
      });
    } catch (error: any) {
      console.error('Error reordering links:', error);
      setError(error.message);
      toast({
        title: "Failed to reorder links",
        description: error.message || "An error occurred while reordering links",
        variant: "destructive"
      });
    }
  };

  return {
    // Form state
    title,
    description,
    slug,
    published,
    profileImageUrl,
    themeColor,
    // UI state
    saving,
    uploading,
    error: error || uploadError,
    localLinks,
    isEditing,
    // Handlers
    setTitle: handleTitleChange,
    setDescription: handleDescriptionChange,
    setSlug,
    setPublished,
    setThemeColor,
    handleProfileImageUpload,
    handleSave,
    handleAddLink,
    handleReorderLinks
  };
};
