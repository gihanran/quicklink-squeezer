
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Enhanced admin status check with additional debugging
  const checkAdminStatus = async () => {
    if (!user) {
      console.log("No user found when checking admin status");
      return false;
    }
    
    try {
      console.log("🔍 Checking admin status for user:", user.id);
      console.log("🔍 User email:", user.email);
      
      // First, make sure we have the most up-to-date user data
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Error getting current user:", userError.message);
        return false;
      }
      
      if (!currentUser) {
        console.log("❌ No current user found in getUser call");
        return false;
      }
      
      console.log("✅ Current user from getUser:", currentUser);
      
      // Direct query to profiles table with more detailed logging
      console.log("🔍 Querying profiles table for admin status with userId:", currentUser.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, email')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error("❌ Error checking admin status:", error.message);
        return false;
      }
      
      console.log("🔍 Admin check result:", data);
      
      // Extra check to ensure data exists
      if (!data) {
        console.log("❌ No profile found for user ID:", currentUser.id);
        
        // Let's try to insert a profile record if it doesn't exist
        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: currentUser.id, email: currentUser.email, is_admin: false }])
          .select('is_admin')
          .maybeSingle();
          
        if (insertError) {
          console.error("❌ Error creating profile:", insertError.message);
          return false;
        }
        
        console.log("✅ Created new profile:", insertedProfile);
        setIsAdmin(false);
        return false;
      }
      
      // Explicitly check for true value
      const adminStatus = data.is_admin === true;
      console.log("✅ Setting admin status to:", adminStatus);
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error("❌ Exception during admin status check:", error);
      return false;
    }
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
          console.log("🔍 User found in session, checking admin status");
          await checkAdminStatus();
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
        console.log("🔍 User found in initial session, checking admin status");
        await checkAdminStatus();
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
      checkAdminStatus,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};
