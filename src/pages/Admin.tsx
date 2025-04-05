
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import AdminNavigation from "@/components/admin/AdminNavigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import MembersList from "@/components/admin/MembersList";
import NotificationCenter from "@/components/admin/NotificationCenter";
import BulkActions from "@/components/admin/BulkActions";
import AdminSettings from "@/components/admin/AdminSettings";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      try {
        console.log("Checking admin access for user ID:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching admin status:", error);
          throw error;
        }

        console.log("Admin check result:", data);
        
        if (!data || data.is_admin !== true) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive"
          });
          navigate('/dashboard');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Something went wrong while verifying admin access",
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full py-4 px-4 bg-white shadow-sm">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <AdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'members' && <MembersList />}
          {activeTab === 'notifications' && <NotificationCenter />}
          {activeTab === 'bulk' && <BulkActions />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
