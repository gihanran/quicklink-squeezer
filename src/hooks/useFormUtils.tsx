
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useFormUtils = () => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const validateForm = (title: string, slug: string, isEditing: boolean) => {
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your landing page",
        variant: "destructive"
      });
      return false;
    }

    if (!slug && !isEditing) {
      toast({
        title: "Missing slug",
        description: "Please provide a slug for your landing page",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const validateLinks = (links: any[], pageId: string | undefined) => {
    if (links.length >= 7) {
      setError('Maximum of 7 links allowed per landing page');
      toast({
        title: "Limit reached",
        description: "Maximum of 7 links allowed per landing page",
        variant: "destructive"
      });
      return false;
    }

    if (!pageId) {
      toast({
        title: "Page not found",
        description: "Please save the page before adding links",
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
    generateSlug,
    validateForm,
    validateLinks
  };
};
