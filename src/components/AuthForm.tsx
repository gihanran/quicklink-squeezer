import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';

import { useAuthForm } from '@/hooks/useAuthForm';
import EmailInput from './auth/EmailInput';
import PasswordInput from './auth/PasswordInput';
import FormSubmitButton from './auth/FormSubmitButton';
import AdminCredentialsButton from './auth/AdminCredentialsButton';
import DebugInfoSection from './auth/DebugInfoSection';
import ModeToggle from './auth/ModeToggle';

const AuthForm = () => {
  const {
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
  } = useAuthForm();
  
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('reset') === 'true') {
      toast({
        title: "Password reset link detected",
        description: "Please enter your new password"
      });
    }
  }, [location]);

  const getTitle = () => {
    return mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password';
  };

  const getDescription = () => {
    return mode === 'signin' 
      ? 'Enter your credentials to access your account' 
      : mode === 'signup'
      ? 'Sign up to create and manage your own short links'
      : 'Enter your email to receive a password reset link';
  };

  const showAdminTools = mode === 'signin';

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {getTitle()}
        </CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          <EmailInput 
            email={email} 
            setEmail={setEmail} 
            disabled={loading} 
          />
          
          {mode !== 'reset' && (
            <PasswordInput 
              password={password} 
              setPassword={setPassword} 
              mode={mode} 
              switchToResetMode={switchToResetMode} 
              disabled={loading} 
            />
          )}
          
          <FormSubmitButton loading={loading} mode={mode} />
        </form>

        {showAdminTools && (
          <>
            <AdminCredentialsButton useAdminCredentials={useAdminCredentials} />
            
            <DebugInfoSection
              email={email}
              password={password}
              showDebugInfo={showDebugInfo}
              toggleDebugInfo={toggleDebugInfo}
            />
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <ModeToggle mode={mode} toggleMode={toggleMode} />
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
