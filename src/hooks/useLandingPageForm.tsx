
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { useFormState } from "./form/useFormState";
import { useImageUploadHandlers } from "./form/useImageUploadHandlers";
import { useLinkOperations } from "./form/useLinkOperations";
import { useSaveHandler } from "./form/useSaveHandler";
import { usePublishState } from "./form/usePublishState";
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
    backgroundOverlay,
    setTitle,
    setDescription,
    setSlug,
    setProfileImageUrl,
    setBackgroundImageUrl,
    setBackgroundOverlay
  } = useFormState({ page, isEditing });
  
  const { published, setPublished } = usePublishState(page?.published);
  const { saving, error, setSaving, setError } = useUIState();
  
  // Image upload handlers
  const { 
    uploading, 
    error: uploadError, 
    handleProfileImageUpload,
    handleBackgroundImageUpload 
  } = useImageUploadHandlers(setProfileImageUrl, setBackgroundImageUrl);
  
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
    backgroundOverlay,
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
    backgroundOverlay,
    // UI state
    saving,
    uploading,
    error: saveHandler.error || uploadError || linkOps.error || error,
    localLinks: linkOps.localLinks,
    isEditing: saveHandler.isEditing,
    // State setters
    setTitle,
    setDescription,
    setSlug,
    setPublished,
    setProfileImageUrl,
    setBackgroundImageUrl,
    setBackgroundOverlay,
    setSaving,
    setError,
    // Image handlers
    handleProfileImageUpload,
    handleBackgroundImageUpload,
    // Save handler
    handleSave: saveHandler.handleSave,
    // Link operations
    handleAddLink: linkOps.handleAddLink,
    handleReorderLinks: linkOps.handleReorderLinks
  };
};
