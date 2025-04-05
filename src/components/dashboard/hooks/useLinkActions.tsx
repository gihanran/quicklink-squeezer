
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UrlData } from "@/utils/url/types";
import { getUserUrls, getUrlStats } from "@/utils/url";

export const useLinkActions = () => {
  const [selectedLink, setSelectedLink] = useState<UrlData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [titleDialogOpen, setTitleDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { toast } = useToast();

  const handleDeleteLink = (link: UrlData) => {
    setSelectedLink(link);
    setDeleteDialogOpen(true);
  };

  const handleEditTitle = (link: UrlData) => {
    setSelectedLink(link);
    setNewTitle(link.title || '');
    setTitleDialogOpen(true);
  };

  const confirmDeleteLink = async (links: UrlData[], setLinks: React.Dispatch<React.SetStateAction<UrlData[]>>, updateStats: () => void) => {
    if (!selectedLink) return;

    try {
      const { error } = await supabase
        .from('short_urls')
        .delete()
        .eq('id', selectedLink.id);

      if (error) throw error;

      setLinks(links.filter(l => l.id !== selectedLink.id));
      setDeleteDialogOpen(false);
      setSelectedLink(null);
      
      updateStats();
      
      toast({
        title: "Link deleted",
        description: "The link has been permanently deleted"
      });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error deleting link",
        description: "Could not delete the link",
        variant: "destructive"
      });
    }
  };

  const confirmUpdateTitle = async (links: UrlData[], setLinks: React.Dispatch<React.SetStateAction<UrlData[]>>) => {
    if (!selectedLink) return;

    try {
      const { error } = await supabase
        .from('short_urls')
        .update({ title: newTitle })
        .eq('id', selectedLink.id);

      if (error) throw error;

      setLinks(links.map(link => 
        link.id === selectedLink.id
          ? { ...link, title: newTitle }
          : link
      ));
      
      setTitleDialogOpen(false);
      setSelectedLink(null);
      setNewTitle('');
      
      toast({
        title: "Title updated",
        description: "The link title has been successfully updated"
      });
    } catch (error) {
      console.error('Error updating title:', error);
      toast({
        title: "Error updating title",
        description: "Could not update the link title",
        variant: "destructive"
      });
    }
  };

  return {
    selectedLink,
    deleteDialogOpen,
    setDeleteDialogOpen,
    titleDialogOpen,
    setTitleDialogOpen,
    newTitle,
    setNewTitle,
    handleDeleteLink,
    handleEditTitle,
    confirmDeleteLink,
    confirmUpdateTitle
  };
};
