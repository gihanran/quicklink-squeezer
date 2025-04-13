
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  LandingPage, 
  LandingPageLink
} from "@/types/landingPage";
import * as landingPageService from "@/services/landingPageService";
import * as landingPageLinkService from "@/services/landingPageLinkService";
import { useLandingPageManagement } from './useLandingPageManagement';
import { useLandingPageLinks } from './useLandingPageLinks';

export const useLandingPages = () => {
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<LandingPage | null>(null);
  const [pageLinks, setPageLinks] = useState<LandingPageLink[]>([]);
  const { toast } = useToast();

  // Use the specialized hooks
  const { createLandingPage, updateLandingPage, deleteLandingPage } = 
    useLandingPageManagement(landingPages, setLandingPages, setSelectedPage);
  
  const { addPageLink, updatePageLink, deletePageLink, updateLinkOrder } = 
    useLandingPageLinks(pageLinks, setPageLinks);

  const fetchLandingPages = async () => {
    try {
      setLoading(true);
      const data = await landingPageService.fetchLandingPages();
      setLandingPages(data);
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
      const data = await landingPageLinkService.fetchPageLinks(landingPageId);
      setPageLinks(data);
      return data;
    } catch (error: any) {
      console.error('Error fetching page links:', error);
      toast({
        title: "Failed to load page links",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  };

  useEffect(() => {
    fetchLandingPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchPageLinks(selectedPage.id);
    } else {
      setPageLinks([]);
    }
  }, [selectedPage]);

  // Handle the case where a page is deleted while it's selected
  useEffect(() => {
    if (selectedPage && !landingPages.some(page => page.id === selectedPage.id)) {
      setSelectedPage(null);
    }
  }, [landingPages, selectedPage]);

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
    fetchLandingPages,
    fetchPageLinks
  };
};
