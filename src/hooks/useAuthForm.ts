import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuthState, ADMIN_EMAIL } from '@/hooks/auth';

// Predefined admin credentials
export const ADMIN_PASSWORD = "admin123";

export type AuthMode = 'signin' | 'signup' | 'reset';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAdminStatus } = useAuthState();
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };

  const useAdminCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
  };

  const toggleMode = () => {
    if (mode === 'reset') {
      setMode('signin');
    } else {
      setMode(mode === 'signin' ? 'signup' : 'signin');
    }
  };

  const switchToResetMode = () => {
    setMode('reset');
    setPassword('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'reset') {
      if (!email) {
        toast({
          title: "Missing information",
          description: "Please enter your email address",
          variant: "destructive"
        });
        return;
      }
      
      setLoading(true);
      
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Password reset email sent",
          description: "Check your email for a link to reset your password"
        });
        
        setMode('signin');
      } catch (error: any) {
        console.error('Password reset error:', error);
        toast({
          title: "Password reset failed",
          description: error.message || "Something went wrong",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
      
      return;
    }
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              email: email,
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account."
        });
        
      } else {
        console.log("🔐 AuthForm: Attempting to sign in with email:", email);
        
        let isAdminLogin = false;
        
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          console.log("✅ AuthForm: Using predefined admin credentials");
          isAdminLogin = true;
          
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', ADMIN_EMAIL)
            .maybeSingle();
            
          if (!existingProfile) {
            console.log("🔍 AuthForm: Creating predefined admin profile");
            const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
              email: ADMIN_EMAIL,
              password: ADMIN_PASSWORD
            });
            
            if (signUpError) throw signUpError;
            
            if (signUpData.user) {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: signUpData.user.id,
                  email: ADMIN_EMAIL,
                  is_admin: true,
                  first_name: "Admin",
                  last_name: "User",
                  full_name: "Admin User"
                });
                
              if (profileError) {
                console.error("❌ AuthForm: Error creating admin profile:", profileError);
                throw profileError;
              }
            }
          }
        }
        
        const { error, data } = await supabase.auth.signInWithPassword({ 
          email, 
          password
        });
        
        if (error) {
          console.error("❌ AuthForm: Login error:", error);
          throw error;
        }
        
        console.log("✅ AuthForm: Login successful, user data:", data.user);
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in."
        });
        
        if (isAdminLogin) {
          navigate('/admin');
          return;
        }
        
        const isAdmin = await checkAdminStatus();
        
        if (isAdmin) {
          console.log("✅ AuthForm: User is admin, redirecting to admin panel");
          navigate('/admin');
        } else {
          console.log("🔍 AuthForm: User is not admin, redirecting to dashboard");
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('❌ AuthForm: Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    loading,
    showDebugInfo,
    handleAuth,
    toggleMode,
    switchToResetMode,
    toggleDebugInfo,
    useAdminCredentials
  };
};
