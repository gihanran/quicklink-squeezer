
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/auth";
import { supabase } from "@/integrations/supabase/client";
import { getUserUrls, getUrlStats } from "@/utils/urlUtils";

// Import our new component files
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import DashboardTabNav from "@/components/dashboard/DashboardTabNav";
import LinkStats from "@/components/dashboard/LinkStats";
import LinksList from "@/components/dashboard/LinksList";
import LinksHeader from "@/components/dashboard/LinksHeader";
import CreateLinkCard from "@/components/dashboard/CreateLinkCard";
import LinkDialogs from "@/components/dashboard/LinkDialogs";

const Dashboard: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [newShortCode, setNewShortCode] = useState('');
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuthState();
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
        setLinks(userLinks);
        
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

  const calculateExpiration = (createdAt: number, expiresAt?: number) => {
    if (!expiresAt) return { percentage: 0, daysLeft: 0 };
    
    const totalDuration = expiresAt - createdAt;
    const elapsed = Date.now() - createdAt;
    const percentage = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
    const daysLeft = Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
    
    return { percentage, daysLeft };
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateNewLink = () => {
    setShowCreateForm(true);
  };

  const handleLinkCreated = () => {
    setShowCreateForm(false);
    getUserUrls().then(setLinks).catch(console.error);
    getUrlStats().then(setStats).catch(console.error);
    toast({
      title: "Link created successfully",
      description: "Your new short link is ready to use",
    });
  };

  const handleDeleteLink = (link: any) => {
    setSelectedLink(link);
    setDeleteDialogOpen(true);
  };

  const handleRenameLink = (link: any) => {
    setSelectedLink(link);
    setNewShortCode(link.shortCode);
    setRenameDialogOpen(true);
  };

  const confirmDeleteLink = async () => {
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
      
      getUrlStats().then(setStats).catch(console.error);
      
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

  const confirmRenameLink = async () => {
    if (!selectedLink || !newShortCode) return;

    try {
      const { error } = await supabase
        .from('short_urls')
        .update({ custom_short_code: newShortCode })
        .eq('id', selectedLink.id);

      if (error) throw error;

      setLinks(links.map(link => 
        link.id === selectedLink.id
          ? { ...link, shortCode: newShortCode }
          : link
      ));
      
      setRenameDialogOpen(false);
      setSelectedLink(null);
      setNewShortCode('');
      
      toast({
        title: "Link renamed",
        description: "The link has been successfully renamed"
      });
    } catch (error) {
      console.error('Error renaming link:', error);
      toast({
        title: "Error renaming link",
        description: "Could not rename the link. The code might already be in use.",
        variant: "destructive"
      });
    }
  };

  const handleUrlShortened = () => {
    // This function can be empty or have additional logic if needed
  };

  const redirectToProfile = () => {
    setShowProfileCompletion(false);
    navigate('/dashboard');
    document.getElementById('profile-trigger')?.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader handleLogout={handleLogout} user={user} />

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <DashboardTabNav links={links}>
          <>
            <LinksHeader handleCreateNewLink={handleCreateNewLink} />

            {showCreateForm && (
              <CreateLinkCard 
                handleLinkCreated={handleLinkCreated} 
                handleUrlShortened={handleUrlShortened} 
              />
            )}

            <LinkStats stats={stats} user={user} />

            <h2 className="text-2xl font-bold mb-4">Your Links</h2>
            
            <LinksList 
              links={links} 
              loading={loading}
              calculateExpiration={calculateExpiration}
              handleCreateNewLink={handleCreateNewLink}
              handleDeleteLink={handleDeleteLink}
              handleRenameLink={handleRenameLink}
            />
          </>
        </DashboardTabNav>
      </main>

      <DashboardFooter />
      
      <LinkDialogs 
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedLink={selectedLink}
        confirmDeleteLink={confirmDeleteLink}
        renameDialogOpen={renameDialogOpen}
        setRenameDialogOpen={setRenameDialogOpen}
        newShortCode={newShortCode}
        setNewShortCode={setNewShortCode}
        confirmRenameLink={confirmRenameLink}
      />
    </div>
  );
};

export default Dashboard;
