
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuthState } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import { getUserUnlockers } from "@/utils/unlocker/unlockersUtil";
import { UrlUnlocker } from "@/utils/unlocker/types";
import CreateUnlockerForm from "@/components/unlocker/CreateUnlockerForm";
import UnlockersList from "@/components/unlocker/UnlockersList";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";
import { AppSidebar } from "@/components/ui/sidebar";

const UrlUnlockers: React.FC = () => {
  const [unlockers, setUnlockers] = useState<UrlUnlocker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuthState();
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
      const fetchedUnlockers = await getUserUnlockers();
      setUnlockers(fetchedUnlockers);
    } catch (error) {
      console.error("Error fetching unlockers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUnlocker = (id: string) => {
    setUnlockers(unlockers.filter(unlocker => unlocker.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-gray-50">
        <AppSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">URL Unlockers</h1>
                <p className="text-gray-600">
                  Create interactive URL unlockers to boost engagement
                </p>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-brand-purple to-brand-blue text-white"
              >
                {showCreateForm ? (
                  "Cancel"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" /> Create Unlocker
                  </>
                )}
              </Button>
            </div>

            {showCreateForm && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <CreateUnlockerForm
                    onSuccess={() => {
                      setShowCreateForm(false);
                      fetchUnlockers();
                    }}
                  />
                </CardContent>
              </Card>
            )}

            <UnlockersList 
              unlockers={unlockers} 
              onDelete={handleDeleteUnlocker} 
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UrlUnlockers;
