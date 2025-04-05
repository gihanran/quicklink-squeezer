
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { getUserUrls, getUrlWithAnalytics } from "@/utils/url";
import { UrlData } from "@/utils/url/types";
import { getUrlStats } from "@/utils/url/urlStore";

export const useDashboardData = () => {
  const [links, setLinks] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const checkProfileCompletion = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('has_completed_profile, first_name, last_name, whatsapp_number, country')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const isComplete = data?.has_completed_profile || 
          Boolean(data?.first_name && data?.last_name && data?.country);
        
        setProfileCompleted(isComplete);
        setShowProfileCompletion(false);
      } catch (error) {
        console.error('Error checking profile completion:', error);
      }
    };

    const fetchLinks = async () => {
      try {
        setLoading(true);
        const userLinks = await getUserUrls();
        
        // Enhance links with analytics data
        const enhancedLinks = await Promise.all(userLinks.map(async (link) => {
          try {
            const linkWithAnalytics = await getUrlWithAnalytics(link.shortCode);
            return linkWithAnalytics || link;
          } catch (e) {
            console.error(`Error enhancing link ${link.shortCode}:`, e);
            return link;
          }
        }));
        
        setLinks(enhancedLinks);
        
        const urlStats = await getUrlStats();
        setStats(urlStats);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkProfileCompletion();
      fetchLinks();
    }
  }, [user, authLoading, navigate, toast]);

  const updateStats = async () => {
    try {
      const urlStats = await getUrlStats();
      setStats(urlStats);
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const handleCreateNewLink = () => {
    setShowCreateForm(true);
  };

  const handleLinkCreated = () => {
    setShowCreateForm(false);
    getUserUrls().then(async (newLinks) => {
      // Enhance links with analytics data
      const enhancedLinks = await Promise.all(newLinks.map(async (link) => {
        try {
          const linkWithAnalytics = await getUrlWithAnalytics(link.shortCode);
          return linkWithAnalytics || link;
        } catch (e) {
          console.error(`Error enhancing link ${link.shortCode}:`, e);
          return link;
        }
      }));
      
      setLinks(enhancedLinks);
    }).catch(console.error);
    updateStats();
    toast({
      title: "Link created successfully",
      description: "Your new short link is ready to use",
    });
  };

  const redirectToProfile = () => {
    setShowProfileCompletion(false);
    navigate('/dashboard');
    document.getElementById('profile-trigger')?.click();
  };

  return {
    links,
    setLinks,
    loading,
    stats,
    showCreateForm,
    setShowCreateForm,
    profileCompleted,
    showProfileCompletion,
    user,
    handleCreateNewLink,
    handleLinkCreated,
    updateStats,
    redirectToProfile
  };
};
