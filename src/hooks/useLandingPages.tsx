
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LandingPage, LandingPageLink } from "@/types/landingPage";

export const useLandingPages = () => {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [pageLinks, setPageLinks] = useState<LandingPageLink[]>([]);
  const { toast } = useToast();

  const fetchLandingPages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLandingPages(data || []);
    } catch (error: any) {
      console.error('Error fetching landing pages:', error);
      toast({
        title: "Failed to load landing pages",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPageLinks = async (landingPageId: string) => {
    try {
      const { data, error } = await supabase
        .from('landing_page_links')
        .select('*')
        .eq('landing_page_id', landingPageId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPageLinks(data || []);
    } catch (error: any) {
      console.error('Error fetching page links:', error);
      toast({
        title: "Failed to load page links",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createLandingPage = async (page: Partial<LandingPage>) => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .insert([page])
        .select()
        .single();

      if (error) throw error;
      
      setLandingPages([data, ...landingPages]);
      setSelectedPage(data);
      
      toast({
        title: "Landing page created",
        description: "Your landing page has been created successfully."
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating landing page:', error);
      toast({
        title: "Failed to create landing page",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateLandingPage = async (id: string, updates: Partial<LandingPage>) => {
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setLandingPages(landingPages.map(page => 
        page.id === id ? { ...page, ...data } : page
      ));
      
      if (selectedPage && selectedPage.id === id) {
        setSelectedPage({ ...selectedPage, ...data });
      }
      
      toast({
        title: "Landing page updated",
        description: "Your landing page has been updated successfully."
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating landing page:', error);
      toast({
        title: "Failed to update landing page",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteLandingPage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLandingPages(landingPages.filter(page => page.id !== id));
      
      if (selectedPage && selectedPage.id === id) {
        setSelectedPage(null);
        setPageLinks([]);
      }
      
      toast({
        title: "Landing page deleted",
        description: "Your landing page has been deleted successfully."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting landing page:', error);
      toast({
        title: "Failed to delete landing page",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const addPageLink = async (link: Partial<LandingPageLink>) => {
    try {
      const { data, error } = await supabase
        .from('landing_page_links')
        .insert([link])
        .select()
        .single();

      if (error) throw error;
      
      setPageLinks([...pageLinks, data]);
      
      toast({
        title: "Link added",
        description: "The link has been added to your landing page."
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding page link:', error);
      toast({
        title: "Failed to add link",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const updatePageLink = async (id: string, updates: Partial<LandingPageLink>) => {
    try {
      const { data, error } = await supabase
        .from('landing_page_links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPageLinks(pageLinks.map(link => 
        link.id === id ? { ...link, ...data } : link
      ));
      
      toast({
        title: "Link updated",
        description: "The link has been updated successfully."
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating page link:', error);
      toast({
        title: "Failed to update link",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const deletePageLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('landing_page_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPageLinks(pageLinks.filter(link => link.id !== id));
      
      toast({
        title: "Link deleted",
        description: "The link has been removed from your landing page."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting page link:', error);
      toast({
        title: "Failed to delete link",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const updateLinkOrder = async (links: LandingPageLink[]) => {
    try {
      const updates = links.map((link, index) => ({
        id: link.id,
        display_order: index
      }));
      
      // Update each link with its new display order
      const promises = updates.map(update => 
        supabase
          .from('landing_page_links')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
      );
      
      await Promise.all(promises);
      
      // Update local state
      setPageLinks(links);
      
      toast({
        title: "Link order updated",
        description: "The order of your links has been updated."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating link order:', error);
      toast({
        title: "Failed to update link order",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchLandingPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchPageLinks(selectedPage.id);
    }
  }, [selectedPage]);

  return {
    landingPages,
    loading,
    selectedPage,
    setSelectedPage,
    pageLinks,
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    addPageLink,
    updatePageLink,
    deletePageLink,
    updateLinkOrder,
    fetchLandingPages
  };
};
