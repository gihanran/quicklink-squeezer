
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuthState, ADMIN_EMAIL } from "@/hooks/auth";
import AdminNavigation from "@/components/admin/AdminNavigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import MembersList from "@/components/admin/MembersList";
import NotificationCenter from "@/components/admin/NotificationCenter";
import BulkActions from "@/components/admin/BulkActions";
import AdminSettings from "@/components/admin/AdminSettings";
import { supabase } from '@/integrations/supabase/client';

// Predefined admin email for direct checks
const ADMIN_EMAIL = "admin@quicklink.com";

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, checkAdminStatus } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      console.log("🔍 Admin page: Verifying admin access");
      
      if (!user) {
        console.log("❌ Admin page: No user found");
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      try {
        console.log("🔍 Admin page: Checking admin status for user ID:", user.id);
        console.log("🔍 Admin page: User email:", user.email);
        
        // Quick check for predefined admin account
        if (user.email === ADMIN_EMAIL) {
          console.log("✅ Admin page: Predefined admin account detected");
          await checkAdminStatus(); // Update context state
          setLoading(false);
          return;
        }
        
        // First check from context
        if (!isAdmin) {
          console.log("🔍 Admin page: Not admin according to context, verifying from database");
          
          // Double check directly from database
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin, email')
            .eq('id', user.id)
            .maybeSingle();
            
          console.log("🔍 Admin page: Database check result:", data);
          
          if (error) {
            console.error("❌ Admin page: Error fetching profile:", error);
            throw error;
          }
          
          if (!data || data.is_admin !== true) {
            console.log("❌ Admin page: User is not admin according to database");
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin panel",
              variant: "destructive"
            });
            navigate('/dashboard');
            return;
          }
          
          // If we got here, user is admin but context didn't know
          console.log("✅ Admin page: Database confirms user is admin, updating context");
          await checkAdminStatus(); // Update the context
        } else {
          console.log("✅ Admin page: User is admin according to context");
        }
        
        console.log("✅ Admin page: Admin access verified successfully");
      } catch (error) {
        console.error("❌ Admin page: Error verifying admin status:", error);
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

    verifyAdminAccess();
  }, [user, navigate, toast, checkAdminStatus, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
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
