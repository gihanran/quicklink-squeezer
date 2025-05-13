
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/auth';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import CreateUnlockerForm from '@/components/unlocker/CreateUnlockerForm';
import UnlockersList from '@/components/unlocker/UnlockersList';
import { getUserUnlockers } from '@/utils/unlocker/unlockersUtil';
import { UrlUnlocker } from '@/utils/unlocker/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { AppSidebar } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar/sidebar-context';

const UrlUnlockers: React.FC = () => {
  const [unlockers, setUnlockers] = useState<UrlUnlocker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('myUnlockers');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const { user, signOut } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchUnlockers();
  }, [user, navigate]);

  const fetchUnlockers = async () => {
    try {
      setLoading(true);
      const data = await getUserUnlockers();
      setUnlockers(data);
    } catch (error) {
      console.error('Error fetching unlockers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateUnlocker = () => {
    setShowCreateForm(true);
    setActiveTab('create');
  };

  const handleUnlockerCreated = () => {
    fetchUnlockers();
    setShowCreateForm(false);
    setActiveTab('myUnlockers');
  };

  const handleDeleteUnlocker = (id: string) => {
    setUnlockers(unlockers.filter(unlocker => unlocker.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader handleLogout={handleLogout} user={user} />

        <div className="flex flex-1">
          <AppSidebar />
          
          <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <Button 
                  variant="ghost" 
                  className="mb-2" 
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold">URL Unlockers</h1>
                <p className="text-gray-500 mt-1">
                  Create button sequences that visitors must complete before accessing your content
                </p>
              </div>
              
              <Button 
                className="mt-4 md:mt-0 bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90"
                onClick={handleCreateUnlocker}
              >
                <Plus className="mr-2 h-5 w-5" /> Create New Unlocker
              </Button>
            </div>

            <Tabs defaultValue="myUnlockers" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="myUnlockers">My URL Unlockers</TabsTrigger>
                <TabsTrigger value="create">Create New</TabsTrigger>
              </TabsList>

              <TabsContent value="myUnlockers">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-12 w-12 border-4 border-t-brand-purple border-r-brand-blue border-b-brand-purple border-l-brand-blue border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <UnlockersList unlockers={unlockers} onDelete={handleDeleteUnlocker} />
                )}
              </TabsContent>

              <TabsContent value="create">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Create URL Unlocker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CreateUnlockerForm onSuccess={handleUnlockerCreated} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default UrlUnlockers;
