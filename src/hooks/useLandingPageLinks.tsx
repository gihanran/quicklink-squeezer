
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  LandingPageLink,
  CreateLandingPageLinkData
} from "@/types/landingPage";
import * as landingPageLinkService from "@/services/landingPageLinkService";

export const useLandingPageLinks = (
  pageLinks: LandingPageLink[], 
  setPageLinks: React.Dispatch<React.SetStateAction<LandingPageLink[]>>
) => {
  const { toast } = useToast();

  const addPageLink = async (link: Partial<LandingPageLink>) => {
    try {
      const linkData: CreateLandingPageLinkData = {
        landing_page_id: link.landing_page_id!,
        title: link.title!,
        url: link.url!,
        icon: link.icon || null,
        display_order: link.display_order || 0
      };

      const data = await landingPageLinkService.addPageLink(linkData);
      
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
      const data = await landingPageLinkService.updatePageLink(id, updates);
      
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
      await landingPageLinkService.deletePageLink(id);
      
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
      
      await landingPageLinkService.updateLinkOrders(updates);
      
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

  return {
    addPageLink,
    updatePageLink,
    deletePageLink,
    updateLinkOrder
  };
};
