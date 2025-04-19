
import { useState } from 'react';

export const useFormState = () => {
  // Basic form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [published, setPublished] = useState(false);
  
  // UI state
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
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
    saving,
    // State setters
    setTitle: handleTitleChange,
    setDescription: handleDescriptionChange,
    setSlug,
    setPublished,
    setSaving
  };
};
