
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  LandingPage,
  CreateLandingPageData
} from "@/types/landingPage";
import * as landingPageService from "@/services/landingPageService";

export const useLandingPageManagement = (
  landingPages: LandingPage[], 
  setLandingPages: React.Dispatch<React.SetStateAction<LandingPage[]>>,
  setSelectedPage: React.Dispatch<React.SetStateAction<LandingPage | null>>
) => {
  const { toast } = useToast();
  const MAX_LANDING_PAGES = 25;

  const createLandingPage = async (page: Partial<LandingPage>) => {
    try {
      // Check if the user has reached their landing page limit
      if (landingPages.length >= MAX_LANDING_PAGES) {
        toast({
          title: "Landing page limit reached",
          description: `You can only create a maximum of ${MAX_LANDING_PAGES} landing pages.`,
          variant: "destructive"
        });
        return null;
      }
      
      // Ensure user_id is set from the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to create a landing page');
      }
      
      const pageData: CreateLandingPageData = {
        title: page.title!,
        description: page.description || null,
        slug: page.slug!,
        published: page.published || false,
        profile_image_url: page.profile_image_url || null,
        user_id: user.id
      };

      const data = await landingPageService.createLandingPage(pageData);
      
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
      const data = await landingPageService.updateLandingPage(id, updates);
      
      setLandingPages(landingPages.map(page => 
        page.id === id ? { ...page, ...data } : page
      ));
      
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
      await landingPageService.deleteLandingPage(id);
      
      setLandingPages(landingPages.filter(page => page.id !== id));
      
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

  return {
    createLandingPage,
    updateLandingPage,
    deleteLandingPage
  };
};
