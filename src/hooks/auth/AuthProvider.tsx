
import { useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './AuthContext';
import { checkAdminStatus, ADMIN_EMAIL } from './adminUtils';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Method to check admin status and update state
  const checkAndUpdateAdminStatus = async (): Promise<boolean> => {
    const adminStatus = await checkAdminStatus(user);
    setIsAdmin(adminStatus);
    return adminStatus;
  };

  useEffect(() => {
    console.log("🔄 AuthProvider initializing...");
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("🔄 Auth state changed:", event, newSession?.user?.email);
        
        if (!mounted) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Check admin status when user changes
        if (newSession?.user) {
          // Special case for predefined admin
          if (newSession.user.email === ADMIN_EMAIL) {
            console.log("✅ Predefined admin detected in auth state change");
            setIsAdmin(true);
          } else {
            console.log("🔍 User found in session, checking admin status");
            await checkAndUpdateAdminStatus();
          }
        } else {
          console.log("❌ No user in session, setting isAdmin to false");
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      console.log("🔍 Initial session check:", existingSession?.user?.email);
      
      if (!mounted) return;
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      // Check admin status on initial load
      if (existingSession?.user) {
        // Special case for predefined admin
        if (existingSession.user.email === ADMIN_EMAIL) {
          console.log("✅ Predefined admin detected in initial session");
          setIsAdmin(true);
        } else {
          console.log("🔍 User found in initial session, checking admin status");
          await checkAndUpdateAdminStatus();
        }
      } else {
        console.log("❌ No user in initial session");
      }
      
      setLoading(false);
    });

    return () => {
      console.log("🔄 AuthProvider cleanup");
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("🔄 Signing out...");
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      isAdmin, 
      checkAdminStatus: checkAndUpdateAdminStatus,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
