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
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to upload an image",
          variant: "destructive"
        });
        throw new Error('You must be logged in to upload an image');
      }
      
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/landing-pages/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('landing_pages')
        .upload(fileName, file, { upsert: true });
        
      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        toast({
          title: "Upload failed",
          description: uploadError.message,
          variant: "destructive"
        });
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('landing_pages')
        .getPublicUrl(fileName);
        
      setProfileImageUrl(data.publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your profile image has been uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error.message);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading the image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your landing page",
        variant: "destructive"
      });
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

  const handleAddLink = async (link: { title: string, url: string }) => {
    if (!link.title || !link.url || !page?.id) {
      toast({
        title: "Invalid link",
        description: "Please provide both title and URL for your link",
        variant: "destructive"
      });
      return;
    }
    
    if (localLinks.length >= 7) {
      setError('Maximum of 7 links allowed per landing page');
      toast({
        title: "Limit reached",
        description: "Maximum of 7 links allowed per landing page",
        variant: "destructive"
      });
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
