import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AtSign, Key, Loader2 } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';

type AuthMode = 'signin' | 'signup' | 'reset';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAdminStatus } = useAuthState();

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
        // Using SignUp with specific options to ensure verification email is sent
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
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in."
        });
        
        console.log("Login successful. Checking admin status...");
        // Use our improved admin status check
        const isAdmin = await checkAdminStatus();
        
        // If admin, redirect to admin panel, otherwise to dashboard
        if (isAdmin) {
          console.log("User is admin, redirecting to admin panel");
          navigate('/admin');
        } else {
          console.log("User is not admin, redirecting to dashboard");
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Enter your credentials to access your account' 
            : mode === 'signup'
            ? 'Sign up to create and manage your own short links'
            : 'Enter your email to receive a password reset link'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          
          {mode !== 'reset' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {mode === 'signin' && (
                  <Button 
                    type="button" 
                    variant="link" 
                    className="px-0 h-auto font-normal text-xs"
                    onClick={switchToResetMode}
                  >
                    Forgot password?
                  </Button>
                )}
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'signin' 
                  ? 'Signing in...' 
                  : mode === 'signup' 
                    ? 'Creating account...' 
                    : 'Sending reset link...'}
              </>
            ) : (
              mode === 'signin' 
                ? 'Sign In' 
                : mode === 'signup' 
                  ? 'Create Account' 
                  : 'Send Reset Link'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Separator />
        <div className="text-center text-sm">
          {mode === 'reset' ? (
            "Remember your password?"
          ) : (
            mode === 'signin' ? "Don't have an account?" : "Already have an account?"
          )}
          <Button variant="link" onClick={toggleMode} className="px-2 py-0">
            {mode === 'reset' 
              ? 'Back to Sign In' 
              : mode === 'signin' 
                ? 'Sign up' 
                : 'Sign in'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
