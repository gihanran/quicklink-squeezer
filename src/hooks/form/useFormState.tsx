
import { useState, useEffect } from 'react';
import { LandingPage, SocialMediaLink } from "@/types/landingPage";
import { generateSlugFromTitle } from '@/utils/slugUtils';

interface UseFormStateProps {
  page: Partial<LandingPage> | null;
  isEditing: boolean;
}

export const useFormState = ({ page, isEditing }: UseFormStateProps) => {
  // Form state
  const [title, setTitle] = useState(page?.title || '');
  const [description, setDescription] = useState(page?.description || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [published, setPublished] = useState(page?.published || false);
  const [profileImageUrl, setProfileImageUrl] = useState(page?.profile_image_url || '');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(page?.background_image_url || null);
  const [themeColor, setThemeColor] = useState(page?.theme_color || '#9b87f5');
  const [buttonStyle, setButtonStyle] = useState<'default' | 'rounded' | 'pill' | 'outline' | 'subtle'>(
    page?.button_style || 'default'
  );
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>(page?.social_links || []);
  
  // UI state
  const [saving, setSaving] = useState(false);

  // Update social links when page changes
  useEffect(() => {
    if (page?.social_links) {
      setSocialLinks(page.social_links);
    }
  }, [page?.social_links]);

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
    saving,
    // State setters
    setTitle: handleTitleChange,
    setDescription: handleDescriptionChange,
    setSlug,
    setPublished,
    setProfileImageUrl,
    setBackgroundImageUrl,
    setThemeColor,
    setButtonStyle,
    setSocialLinks,
    setSaving
  };
};
