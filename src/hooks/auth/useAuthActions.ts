
import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/auth';
import { AuthFormState, AuthMode } from './types';

export const useAuthActions = (
  state: AuthFormState,
  setLoading: (loading: boolean) => void,
  setMode: (mode: AuthMode) => void
) => {
  const navigate = useNavigate();
  const { checkAdminStatus } = useAuthState();
  
  const toggleShowPassword = () => {
    return !state.showPassword;
  };

  const toggleMode = () => {
    if (state.mode === 'reset') {
      setMode('signin');
    } else {
      setMode(state.mode === 'signin' ? 'signup' : 'signin');
    }
  };

  const switchToResetMode = () => {
    setMode('reset');
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    
    if (state.mode === 'reset') {
      if (!state.email) {
        toast({
          title: "Missing information",
          description: "Please enter your email address",
          variant: "destructive"
        });
        return;
      }
      
      setLoading(true);
      
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(state.email, {
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
    
    if (!state.email || !state.password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    if (state.mode === 'signup') {
      if (!state.firstName || !state.lastName) {
        toast({
          title: "Missing information",
          description: "Please enter your first name and last name",
          variant: "destructive"
        });
        return;
      }
      
      // Add check for country validation
      if (!state.country || state.country === "none") {
        toast({
          title: "Missing information",
          description: "Please select your country",
          variant: "destructive"
        });
        return;
      }
    }
    
    setLoading(true);
    
    try {
      if (state.mode === 'signup') {
        // Process the country value (if "none", treat as undefined)
        const userCountry = state.country === "none" ? undefined : state.country;
        
        const { error } = await supabase.auth.signUp({ 
          email: state.email, 
          password: state.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              email: state.email,
              first_name: state.firstName,
              last_name: state.lastName,
              whatsapp_number: state.whatsAppNumber,
              country: userCountry
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account."
        });
        
      } else {
        console.log("🔐 AuthForm: Attempting to sign in with email:", state.email);
        
        const { error, data } = await supabase.auth.signInWithPassword({ 
          email: state.email, 
          password: state.password
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
    toggleShowPassword,
    toggleMode,
    switchToResetMode,
    handleAuth
  };
};
