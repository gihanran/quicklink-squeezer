
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useFormValidation = () => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validatePageSave = (title: string) => {
    if (!title) {
      setError("Title is required");
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return false;
    }
    setError(null);
    return true;
  };

  const validateLinkAdd = (link: any, pageId?: string, existingLinks?: any[]) => {
    if (!link.title) {
      setError("Link title is required");
      toast({
        title: "Missing title",
        description: "Please provide a title for your link",
        variant: "destructive"
      });
      return false;
    }

    if (!link.url) {
      setError("Link URL is required");
      toast({
        title: "Missing URL",
        description: "Please provide a URL for your link",
        variant: "destructive"
      });
      return false;
    }

    setError(null);
    return true;
  };

  return {
    error,
    setError,
    validatePageSave,
    validateLinkAdd
  };
};
