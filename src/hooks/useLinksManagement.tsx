
import { useState, useEffect } from 'react';
import { LandingPageLink } from "@/types/landingPage";
import { useToast } from "@/hooks/use-toast";
import { useFormUtils } from './useFormUtils';

interface UseLinksManagementProps {
  links: LandingPageLink[];
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
}

export const useLinksManagement = ({
  links,
  onAddLink,
  onUpdateLinkOrder
}: UseLinksManagementProps) => {
  const [localLinks, setLocalLinks] = useState<LandingPageLink[]>(links);
  const { toast } = useToast();
  const { validateLinks, setError } = useFormUtils();

  useEffect(() => {
    setLocalLinks(links);
  }, [links]);

  const handleAddLink = async (link: { title: string, url: string }, pageId?: string) => {
    if (!link.title || !link.url || !pageId) {
      toast({
        title: "Invalid link",
        description: "Please provide both title and URL for your link",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateLinks(localLinks, pageId)) {
      return;
    }
    
    try {
      const newLink = await onAddLink({
        landing_page_id: pageId,
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
    setLocalLinks,
    handleAddLink,
    handleReorderLinks
  };
};
