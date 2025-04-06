import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/AuthForm';
import { Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuthState, ADMIN_EMAIL } from '@/hooks/auth';
import Footer from '@/components/Footer';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAdmin, checkAdminStatus } = useAuthState();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("🔍 Auth page: Checking user session");
        setChecking(true);
        
        if (user) {
          console.log("✅ Auth page: User already signed in", user.email);
          
          if (user.email === ADMIN_EMAIL) {
            console.log("✅ Auth page: Predefined admin account detected, redirecting to admin panel");
            navigate('/admin');
            return;
          }
          
          console.log("🔍 Auth page: Checking admin status");
          
          try {
            console.log("🔍 Auth page: Verifying admin status directly from database");
            const { data, error } = await supabase
              .from('profiles')
              .select('is_admin, email')
              .eq('id', user.id)
              .maybeSingle();
              
            console.log("🔍 Auth page: Direct admin check result:", data);
            
            if (error) {
              console.error("❌ Auth page: Error fetching profile:", error);
            }
            
            if (data && data.is_admin === true) {
              console.log("✅ Auth page: User is admin according to database, redirecting to admin panel");
              toast({
                title: "Admin Session Detected",
                description: "Redirecting to admin panel"
              });
              navigate('/admin');
              return;
            } else {
              console.log("🔍 Auth page: User is not admin according to database");
            }
          } catch (err) {
            console.error("❌ Auth page: Exception during direct admin check:", err);
          }
          
          const state = location.state as { redirectTo?: string } | null;
          const redirectPath = state?.redirectTo || '/dashboard';
          
          console.log("✅ Auth page: User is not admin, redirecting to:", redirectPath);
          navigate(redirectPath);
        } else {
          console.log("🔍 Auth page: No active session found");
        }
      } catch (err) {
        console.error("❌ Auth page: Error checking user session:", err);
        toast({
          title: "Error",
          description: "There was a problem checking your session",
          variant: "destructive"
        });
      } finally {
        setChecking(false);
      }
    };
    
    checkUser();
  }, [user, navigate, location, toast, isAdmin, checkAdminStatus]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center">
            <Link2 className="h-6 w-6 text-brand-purple mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              <a href="/">Shortit</a>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;
