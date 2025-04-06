
import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type AuthMode = 'signin' | 'signup' | 'reset';

export const useAuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [country, setCountry] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const toggleMode = () => {
    if (mode === 'signin') {
      setMode('signup');
    } else {
      setMode('signin');
    }
  };

  const switchToResetMode = () => {
    setMode('reset');
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast({
          title: "Sign in successful",
          description: "Welcome back!"
        });

        // Get referrer from location state or default to dashboard
        const state = location.state as { redirectTo?: string } | null;
        const redirectPath = state?.redirectTo || '/dashboard';
        navigate(redirectPath);

      } else if (mode === 'signup') {
        // Create metadata for the user profile
        const metadata = {
          first_name: firstName,
          last_name: lastName,
          whatsapp_number: whatsAppNumber,
          country: country
        };

        // Sign up the user with metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata
          }
        });

        if (error) throw error;

        if (data?.user) {
          // Additionally update the profiles table directly to ensure data is saved
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              first_name: firstName,
              last_name: lastName,
              whatsapp_number: whatsAppNumber,
              country: country,
              full_name: `${firstName} ${lastName}`.trim(),
              has_completed_profile: Boolean(firstName && lastName && country)
            })
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }

        toast({
          title: "Account created",
          description: "Welcome to QuickLink Squeezer!"
        });

        navigate('/dashboard');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`
        });

        if (error) throw error;

        toast({
          title: "Password reset email sent",
          description: "Check your email for the reset link"
        });

        setMode('signin');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication error",
        description: error.message || "An error occurred during authentication",
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
    country,
    setCountry,
    mode,
    loading,
    handleAuth,
    toggleMode,
    switchToResetMode,
    showPassword,
    toggleShowPassword
  };
};
