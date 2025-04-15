
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { LandingPageLink } from "@/types/landingPage";

export const useFormValidation = () => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validatePageSave = (title: string) => {
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your bio card",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateLinkAdd = (link: { title: string, url: string }, pageId: string | undefined, currentLinks: LandingPageLink[]) => {
    if (!link.title || !link.url || !pageId) {
      toast({
        title: "Invalid link",
        description: "Please provide both title and URL for your link",
        variant: "destructive"
      });
      return false;
    }
    
    if (currentLinks.length >= 7) {
      setError('Maximum of 7 links allowed per bio card');
      toast({
        title: "Limit reached",
        description: "Maximum of 7 links allowed per bio card",
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
