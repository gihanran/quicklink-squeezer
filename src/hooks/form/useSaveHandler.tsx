
import { useToast } from "@/hooks/use-toast";

interface UseSaveHandlerProps {
  formState: any;
  onSave: (data: any) => Promise<any>;
  setSaving: (saving: boolean) => void;
}

export const useSaveHandler = ({
  formState,
  onSave,
  setSaving
}: UseSaveHandlerProps) => {
  const { toast } = useToast();
  const error = null;
  const isEditing = false;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formState);
      toast({
        title: "Saved",
        description: "Your data has been saved successfully"
      });
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: "Save failed",
        description: error.message || "An error occurred while saving",
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
