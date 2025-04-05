import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, Clock, Globe, Smartphone, Link2, UserCircle, Bell, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserUrls, getUrlStats } from "@/utils/urlUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import ProfileSection from "@/components/ProfileSection";
import NotificationsSection from "@/components/NotificationsSection";
import SettingsSection from "@/components/SettingsSection";
import LinkAnalytics from "@/components/LinkAnalytics";

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
          Boolean(data?.first_name && data?.last_name && data?.whatsapp_number && data?.country);
        
        setProfileCompleted(isComplete);
        setShowProfileCompletion(!isComplete);
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
    if (!profileCompleted) {
      setShowProfileCompletion(true);
      toast({
        title: "Complete your profile",
        description: "Please complete your profile information before creating links",
        variant: "destructive"
      });
      return;
    }
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
  };

  const redirectToProfile = () => {
    setShowProfileCompletion(false);
    navigate('/dashboard');
    document.getElementById('profile-trigger')?.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
                  <ChartBar className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Home
              </a>
              {user?.id && (
                <a 
                  href="/admin" 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Admin
                </a>
              )}
              <button 
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        {showProfileCompletion && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-yellow-800">Complete Your Profile</h2>
                <p className="text-yellow-700">
                  Please complete your profile information before you can create links.
                </p>
              </div>
              <Button variant="secondary" onClick={redirectToProfile}>
                Go to Profile
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4 mb-8">
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              <span className="hidden md:inline">My Links</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <ChartBar className="h-4 w-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger id="profile-trigger" value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Your Links Dashboard</h1>
                <p className="text-gray-600">Track and manage your shortened links</p>
              </div>
              <Button 
                onClick={handleCreateNewLink}
                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
              >
                Create New Link
              </Button>
            </div>

            {showCreateForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Create New Link</CardTitle>
                  <CardDescription>Enter a URL to shorten</CardDescription>
                </CardHeader>
                <CardContent>
                  <UrlShortenerForm 
                    onUrlShortened={handleUrlShortened} 
                    onSuccess={handleLinkCreated} 
                  />
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{stats.totalLinks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{stats.totalClicks}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">User ID</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium">{user?.id ? user.id.slice(0, 8) + '...' : 'Loading...'}</p>
                  <p className="text-sm text-gray-500">Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold mb-4">Your Links</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
              </div>
            ) : links.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't created any links yet.</p>
                  <Button onClick={handleCreateNewLink}>Create Your First Link</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {links.map(link => {
                  const { percentage, daysLeft } = calculateExpiration(link.createdAt, link.expiresAt);
                  
                  return (
                    <Card key={link.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                            <div>
                              <h3 className="text-lg font-semibold mb-1 truncate max-w-md">
                                {link.originalUrl}
                              </h3>
                              <div className="flex items-center">
                                <span className="text-brand-purple font-medium mr-2">
                                  {window.location.origin}/s/{link.shortCode}
                                </span>
                                <button 
                                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 mr-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/s/${link.shortCode}`);
                                    toast({ description: "Link copied to clipboard" });
                                  }}
                                >
                                  Copy
                                </button>
                                <button
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                  onClick={() => handleRenameLink(link)}
                                >
                                  Rename
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center mt-4 md:mt-0">
                              <span className="text-lg font-medium mr-3">{link.visits} clicks</span>
                              <Button variant="secondary" size="sm" className="mr-2">
                                View Details
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteLink(link)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          
                          {link.expiresAt && (
                            <div className="mb-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Link expiration</span>
                                <span>{daysLeft} days left</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <Smartphone className="h-5 w-5 text-brand-purple mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Devices</p>
                                <p className="text-sm">
                                  {link.devices ? (
                                    `Desktop: ${link.devices.desktop || 0}, Mobile: ${link.devices.mobile || 0}`
                                  ) : "No data yet"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Globe className="h-5 w-5 text-brand-blue mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Top Locations</p>
                                <p className="text-sm truncate">
                                  {link.locations ? (
                                    Object.entries(link.locations)
                                      .slice(0, 2)
                                      .map(([country, count]) => `${country}: ${count}`)
                                      .join(', ')
                                  ) : "No data yet"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-5 w-5 text-green-500 mr-2" />
                              <div>
                                <p className="text-xs text-gray-500">Created</p>
                                <p className="text-sm">
                                  {new Date(link.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <LinkAnalytics links={links} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsSection />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="w-full py-6 bg-white border-t mt-auto">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuickLink Squeezer. All rights reserved.
          </p>
        </div>
      </footer>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-3 rounded-md my-4">
            <p className="text-sm font-medium">{selectedLink?.originalUrl}</p>
            <p className="text-xs text-gray-500">
              {window.location.origin}/s/{selectedLink?.shortCode}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteLink}>
              Delete Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Link</DialogTitle>
            <DialogDescription>
              Enter a new custom code for your shortened link.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="shortCode" className="mb-2 block">Custom Short Code</Label>
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">{window.location.origin}/s/</span>
              <Input
                id="shortCode"
                value={newShortCode}
                onChange={(e) => setNewShortCode(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Only use letters, numbers, hyphens, and underscores
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRenameLink}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
