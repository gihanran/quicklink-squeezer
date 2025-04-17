
import { useState } from 'react';
import { LandingPage } from "@/types/landingPage";
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
  
  // UI state
  const [saving, setSaving] = useState(false);

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
    saving,
    // State setters
    setTitle: handleTitleChange,
    setDescription: handleDescriptionChange,
    setSlug,
    setPublished,
    setProfileImageUrl,
    setSaving
  };
};
