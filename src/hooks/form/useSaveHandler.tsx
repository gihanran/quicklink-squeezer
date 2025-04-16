
import { useToast } from "@/hooks/use-toast";
import { LandingPage } from "@/types/landingPage";
import { useFormValidation } from '../useFormValidation';

interface UseSaveHandlerProps {
  page: Partial<LandingPage> | null;
  formState: {
    title: string;
    description: string;
    slug: string;
    published: boolean;
    profileImageUrl: string;
    backgroundImageUrl: string | null;
    themeColor: string;
    buttonStyle: 'default' | 'rounded' | 'pill' | 'outline' | 'subtle';
    socialLinks: any[];
  };
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  setSaving: (saving: boolean) => void;
}

export const useSaveHandler = ({
  page,
  formState,
  onSave,
  setSaving
}: UseSaveHandlerProps) => {
  const { toast } = useToast();
  const { error, setError, validatePageSave } = useFormValidation();
  const isEditing = !!page?.id;

  const handleSave = async () => {
    if (!validatePageSave(formState.title)) return;

    setSaving(true);
    try {
      const updates: Partial<LandingPage> = {
        title: formState.title,
        description: formState.description || null,
        slug: formState.slug,
        published: formState.published,
        profile_image_url: formState.profileImageUrl || null,
        background_image_url: formState.backgroundImageUrl || null,
        theme_color: formState.themeColor,
        button_style: formState.buttonStyle,
        social_links: formState.socialLinks
      };

      if (!isEditing) {
        await onSave(updates);
        toast({
          title: "Page created",
          description: "Your bio card has been created successfully"
        });
      } else {
        await onSave({ ...updates, id: page!.id });
        toast({
          title: "Page updated",
          description: "Your bio card has been updated successfully"
        });
      }
    } catch (error: any) {
      console.error('Error saving bio card:', error);
      setError(error.message);
      toast({
        title: "Save failed",
        description: error.message || "An error occurred while saving the bio card",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    error,
    isEditing,
    handleSave
  };
};
