
import React, { createContext, useContext } from 'react';
import { LandingPage, LandingPageLink, SocialMediaLink } from "@/types/landingPage";
import { useLandingPageForm } from '@/hooks/useLandingPageForm';

interface FormContextType {
  page: Partial<LandingPage> | null;
  title: string;
  description: string;
  slug: string;
  published: boolean;
  profileImageUrl: string;
  themeColor: string;
  buttonStyle: string;
  socialLinks: SocialMediaLink[];
  backgroundImageUrl: string | null;
  saving: boolean;
  uploading: boolean;
  error: string | null;
  localLinks: LandingPageLink[];
  isEditing: boolean;
  setTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setSlug: (value: string) => void;
  setPublished: (value: boolean) => void;
  setThemeColor: (value: string) => void;
  setButtonStyle: (value: string) => void;
  setSocialLinks: (links: SocialMediaLink[]) => void;
  setBackgroundImageUrl: (url: string | null) => void;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleSave: () => void;
  handleAddLink: (link: { title: string, url: string }) => void;
  handleReorderLinks: (links: LandingPageLink[]) => Promise<void>;
  onDeleteLink: (id: string) => Promise<boolean>;
  onBack: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

interface FormProviderProps {
  children: React.ReactNode;
  page: Partial<LandingPage> | null;
  links: LandingPageLink[];
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onDeleteLink: (id: string) => Promise<boolean>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
  onBack: () => void;
}

export const FormProvider: React.FC<FormProviderProps> = ({ 
  children, 
  page,
  links,
  onSave,
  onAddLink,
  onDeleteLink,
  onUpdateLinkOrder,
  onBack
}) => {
  const {
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
    uploading,
    error,
    localLinks,
    isEditing,
    setTitle,
    setDescription,
    setSlug,
    setPublished,
    setThemeColor,
    setButtonStyle,
    setSocialLinks,
    setBackgroundImageUrl,
    handleProfileImageUpload,
    handleBackgroundImageUpload,
    handleSave,
    handleAddLink,
    handleReorderLinks
  } = useLandingPageForm({
    page,
    links,
    onSave,
    onAddLink,
    onUpdateLinkOrder
  });

  // Fix for the type mismatch - wrap the setButtonStyle function to adapt the types
  const handleButtonStyleChange = (value: string) => {
    if (value === 'default' || value === 'rounded' || value === 'pill' || value === 'outline' || value === 'subtle') {
      setButtonStyle(value);
    }
  };

  const value: FormContextType = {
    page,
    title,
    description,
    slug,
    published,
    profileImageUrl,
    themeColor,
    buttonStyle,
    socialLinks,
    backgroundImageUrl,
    saving,
    uploading,
    error,
    localLinks,
    isEditing,
    setTitle,
    setDescription,
    setSlug,
    setPublished,
    setThemeColor,
    setButtonStyle: handleButtonStyleChange, // Use the wrapper function here
    setSocialLinks,
    setBackgroundImageUrl,
    handleProfileImageUpload,
    handleBackgroundImageUpload,
    handleSave,
    handleAddLink,
    handleReorderLinks,
    onDeleteLink,
    onBack
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};
