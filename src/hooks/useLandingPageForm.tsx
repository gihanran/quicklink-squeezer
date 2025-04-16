
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { useFormState } from "./form/useFormState";
import { useImageUploadHandlers } from "./form/useImageUploadHandlers";
import { useLinkOperations } from "./form/useLinkOperations";
import { useSaveHandler } from "./form/useSaveHandler";
import { useSocialLinks } from "./form/useSocialLinks";
import { usePublishState } from "./form/usePublishState";
import { useThemeSettings } from "./form/useThemeSettings";
import { useUIState } from "./form/useUIState";

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
  const isEditing = !!page?.id;
  
  // Use the smaller focused hooks
  const { 
    title, 
    description, 
    slug, 
    profileImageUrl, 
    backgroundImageUrl,
    setTitle,
    setDescription,
    setSlug,
    setProfileImageUrl,
    setBackgroundImageUrl
  } = useFormState({ page, isEditing });
  
  const { socialLinks, setSocialLinks } = useSocialLinks(page?.social_links);
  const { published, setPublished } = usePublishState(page?.published);
  const { themeColor, buttonStyle, setThemeColor, setButtonStyle } = useThemeSettings(
    page?.theme_color,
    page?.button_style
  );
  const { saving, error, setSaving, setError } = useUIState();
  
  // Image upload handlers
  const imageHandlers = useImageUploadHandlers(
    setProfileImageUrl,
    setBackgroundImageUrl
  );
  
  // Link operations
  const linkOps = useLinkOperations({
    links,
    pageId: page?.id,
    onAddLink,
    onUpdateLinkOrder
  });
  
  // Save handler
  const formState = {
    title,
    description,
    slug,
    published,
    profileImageUrl,
    backgroundImageUrl,
    themeColor,
    buttonStyle,
    socialLinks,
    saving
  };
  
  const saveHandler = useSaveHandler({
    page,
    formState,
    onSave,
    setSaving
  });

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
    uploading: imageHandlers.uploading,
    error: saveHandler.error || imageHandlers.error || linkOps.error || error,
    localLinks: linkOps.localLinks,
    isEditing: saveHandler.isEditing,
    // State setters
    setTitle,
    setDescription,
    setSlug,
    setPublished,
    setProfileImageUrl,
    setBackgroundImageUrl,
    setThemeColor,
    setButtonStyle,
    setSocialLinks,
    setSaving,
    setError,
    // Image handlers
    handleProfileImageUpload: imageHandlers.handleProfileImageUpload,
    handleBackgroundImageUpload: imageHandlers.handleBackgroundImageUpload,
    // Save handler
    handleSave: saveHandler.handleSave,
    // Link operations
    handleAddLink: linkOps.handleAddLink,
    handleReorderLinks: linkOps.handleReorderLinks
  };
};
