import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthMode } from '@/hooks/auth';

type FormSubmitButtonProps = {
  loading: boolean;
  mode: AuthMode;
};

const FormSubmitButton = ({ loading, mode }: FormSubmitButtonProps) => {
  const getButtonText = () => {
    if (loading) {
      return mode === 'signin' 
        ? 'Signing in...' 
        : mode === 'signup' 
          ? 'Creating account...' 
          : 'Sending reset link...';
    } else {
      return mode === 'signin' 
        ? 'Sign In' 
        : mode === 'signup' 
          ? 'Create Account' 
          : 'Send Reset Link';
    }
  };
  
  return (
    <Button type="submit" className="w-full" disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {getButtonText()}
    </Button>
  );
};

export default FormSubmitButton;
