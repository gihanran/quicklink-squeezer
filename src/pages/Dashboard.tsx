
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartBar, Clock, Globe, Smartphone, Link2, UserCircle, CreditCard, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getUserUrls, getUrlStats } from "@/utils/urlUtils";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import ProfileSection from "@/components/ProfileSection";
import BillingSection from "@/components/BillingSection";
import SettingsSection from "@/components/SettingsSection";
import LinkAnalytics from "@/components/LinkAnalytics";

const Dashboard: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0 });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

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
      fetchLinks();
    }
  }, [user, authLoading, navigate, toast]);

  // Calculate days remaining and percentage for expiration
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
    // Refresh links after creating a new one
    getUserUrls().then(setLinks).catch(console.error);
    getUrlStats().then(setStats).catch(console.error);
    toast({
      title: "Link created successfully",
      description: "Your new short link is ready to use",
    });
  };

  // Dummy function to pass as onUrlShortened prop (required by UrlShortenerForm)
  const handleUrlShortened = () => {
    // The actual functionality is handled in handleLinkCreated via onSuccess
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
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
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
                  <CardTitle className="text-lg font-medium">Subscription Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-green-600">Premium</p>
                  <p className="text-sm text-gray-500">Renews on May 15, 2023</p>
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
                                  className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/s/${link.shortCode}`);
                                    toast({ description: "Link copied to clipboard" });
                                  }}
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center mt-4 md:mt-0">
                              <span className="text-lg font-medium mr-3">{link.visits} clicks</span>
                              <Button variant="secondary" size="sm">
                                View Details
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

          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BillingSection />
              <SettingsSection />
            </div>
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
    </div>
  );
};

export default Dashboard;
