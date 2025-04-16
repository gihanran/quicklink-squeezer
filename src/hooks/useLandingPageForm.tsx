
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { useFormState } from "./form/useFormState";
import { useImageUploadHandlers } from "./form/useImageUploadHandlers";
import { useLinkOperations } from "./form/useLinkOperations";
import { useSaveHandler } from "./form/useSaveHandler";

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
  
  // Form state management
  const formState = useFormState({ page, isEditing });
  
  // Image upload handlers
  const imageHandlers = useImageUploadHandlers(
    formState.setProfileImageUrl,
    formState.setBackgroundImageUrl
  );
  
  // Link operations
  const linkOps = useLinkOperations({
    links,
    pageId: page?.id,
    onAddLink,
    onUpdateLinkOrder
  });
  
  // Save handler
  const saveHandler = useSaveHandler({
    page,
    formState,
    onSave,
    setSaving: formState.setSaving
  });

  return {
    // Form state
    ...formState,
    // UI state
    saving: formState.saving,
    uploading: imageHandlers.uploading,
    error: saveHandler.error || imageHandlers.error || linkOps.error,
    localLinks: linkOps.localLinks,
    isEditing: saveHandler.isEditing,
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
