
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthForm from '@/components/AuthForm';
import { Link2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session retrieval error:", error);
          return;
        }
        
        if (data.session) {
          console.log("User already signed in, redirecting");
          console.log("Session user:", data.session.user);
          
          // Get admin status directly
          const userId = data.session.user.id;
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', userId)
            .maybeSingle();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
          }
          
          console.log("Profile data:", profileData);
          
          // Redirect based on admin status
          if (profileData?.is_admin === true) {
            console.log("User is admin, redirecting to admin panel");
            navigate('/admin');
          } else {
            // Check if there's a redirect path in the location state
            const state = location.state as { redirectTo?: string } | null;
            const redirectPath = state?.redirectTo || '/dashboard';
            
            console.log("User is not admin, redirecting to:", redirectPath);
            navigate(redirectPath);
          }
        } else {
          console.log("No active session found");
        }
      } catch (err) {
        console.error("Error checking user session:", err);
        toast({
          title: "Error",
          description: "There was a problem checking your session",
          variant: "destructive"
        });
      }
    };
    
    checkUser();
  }, [navigate, location, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-4xl mx-auto">
          <div className="flex items-center">
            <Link2 className="h-6 w-6 text-brand-purple mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
              <a href="/">QuickLink Squeezer</a>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>

      <footer className="w-full py-6 bg-white border-t">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuickLink Squeezer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
