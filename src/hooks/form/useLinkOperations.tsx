
import { useState, useEffect } from 'react';
import { LandingPageLink } from "@/types/landingPage";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation } from '../useFormValidation';

interface UseLinkOperationsProps {
  links: LandingPageLink[];
  pageId?: string;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
}

export const useLinkOperations = ({
  links,
  pageId,
  onAddLink,
  onUpdateLinkOrder
}: UseLinkOperationsProps) => {
  const [localLinks, setLocalLinks] = useState<LandingPageLink[]>(links);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { validateLinkAdd } = useFormValidation();

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  const handleAddLink = async (link: { title: string, url: string }) => {
    if (!validateLinkAdd(link, pageId, localLinks)) return;
    
    try {
      const newLink = await onAddLink({
        landing_page_id: pageId!,
        title: link.title,
        url: link.url.startsWith('http') ? link.url : `https://${link.url}`,
        display_order: localLinks.length
      });

      if (newLink) {
        setLocalLinks([...localLinks, newLink]);
        toast({
          title: "Link added",
          description: "Your link has been added successfully"
        });
      }
    } catch (error: any) {
      console.error('Error adding link:', error);
      setError(error.message);
      toast({
        title: "Failed to add link",
        description: error.message || "An error occurred while adding the link",
        variant: "destructive"
      });
    }
  };

  const handleReorderLinks = async (reorderedLinks: LandingPageLink[]) => {
    try {
      setError(null);
      await onUpdateLinkOrder(reorderedLinks);
      setLocalLinks(reorderedLinks);
      toast({
        title: "Links reordered",
        description: "Your links have been reordered successfully"
      });
    } catch (error: any) {
      console.error('Error reordering links:', error);
      setError(error.message);
      toast({
        title: "Failed to reorder links",
        description: error.message || "An error occurred while reordering links",
        variant: "destructive"
      });
    }
  };

  return {
    localLinks,
    error,
    setError,
    handleAddLink,
    handleReorderLinks
  };
};
