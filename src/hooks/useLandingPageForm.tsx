
import { useState, useEffect } from 'react';
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [themeColor, setThemeColor] = useState(page?.theme_color || '#9b87f5');
  
  // UI state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localLinks, setLocalLinks] = useState<LandingPageLink[]>(links);
  
  const { toast } = useToast();
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
    }
  };

  const handleReorderLinks = async (reorderedLinks: LandingPageLink[]) => {
    try {
      setError(null);
      await onUpdateLinkOrder(reorderedLinks);
      setLocalLinks(reorderedLinks);
    } catch (error: any) {
      console.error('Error reordering links:', error);
      setError(error.message);
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
    error,
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

// Helper function moved from the service
const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/landing-pages/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('landing_pages')
    .upload(fileName, file, { upsert: true });
  
  if (uploadError) throw uploadError;
  
  const { data } = supabase.storage
    .from('landing_pages')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};
