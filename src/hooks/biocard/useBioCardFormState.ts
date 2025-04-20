
import { useState } from 'react';
import { BioCard } from '@/types/bioCardTypes';

export const useBioCardFormState = (initialData?: BioCard) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [bgColor, setBgColor] = useState(initialData?.bg_color || '#ffffff');
  const [buttonColor, setButtonColor] = useState(initialData?.button_color || '#6366f1');
  const [buttonStyle, setButtonStyle] = useState(initialData?.button_style || 'rounded');
  const [saving, setSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(initialData?.profile_image_url || '');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState(initialData?.background_image_url || '');
  const [links, setLinks] = useState<any[]>(initialData?.links || []);
  const [socialLinks, setSocialLinks] = useState<any[]>(initialData?.social_links || []);
  const [colorPickerOpen, setColorPickerOpen] = useState<string | null>(null);

  return {
    formState: {
      title,
      slug,
      description,
      bgColor,
      buttonColor,
      buttonStyle,
      saving,
      profileImageUrl,
      backgroundImageUrl,
      links,
      socialLinks,
      colorPickerOpen,
    },
    setters: {
      setTitle,
      setSlug,
      setDescription,
      setBgColor,
      setButtonColor,
      setButtonStyle,
      setSaving,
      setProfileImageUrl,
      setBackgroundImageUrl,
      setLinks,
      setSocialLinks,
      setColorPickerOpen,
    }
  };
};
