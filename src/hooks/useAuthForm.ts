
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/auth';

export type AuthMode = 'signin' | 'signup' | 'reset';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { checkAdminStatus } = useAuthState();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
    
    if (mode === 'signup') {
      if (!firstName || !lastName) {
        toast({
          title: "Missing information",
          description: "Please enter your first name and last name",
          variant: "destructive"
        });
        return;
      }
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
              first_name: firstName,
              last_name: lastName,
              whatsapp_number: whatsAppNumber
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
    firstName,
    setFirstName,
    lastName,
    setLastName,
    whatsAppNumber,
    setWhatsAppNumber,
    mode,
    loading,
    showPassword,
    toggleShowPassword,
    handleAuth,
    toggleMode,
    switchToResetMode
  };
};
