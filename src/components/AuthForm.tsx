
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

import { useAuthForm } from '@/hooks/auth';
import EmailInput from './auth/EmailInput';
import PasswordInput from './auth/PasswordInput';
import FormSubmitButton from './auth/FormSubmitButton';
import ModeToggle from './auth/ModeToggle';
import SignupFields from './auth/SignupFields';
import CountrySelector from './auth/CountrySelector';

const AuthForm = () => {
  const {
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
          
          {mode === 'signup' && (
            <>
              <SignupFields
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                whatsAppNumber={whatsAppNumber}
                setWhatsAppNumber={setWhatsAppNumber}
                disabled={loading}
              />
              <CountrySelector
                value={country}
                onChange={setCountry}
                disabled={loading}
              />
            </>
          )}
          
          {mode !== 'reset' && (
            <PasswordInput 
              password={password} 
              setPassword={setPassword} 
              mode={mode} 
              switchToResetMode={switchToResetMode}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
              disabled={loading} 
            />
          )}
          
          <FormSubmitButton loading={loading} mode={mode} />
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col">
        <ModeToggle mode={mode} toggleMode={toggleMode} />
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
