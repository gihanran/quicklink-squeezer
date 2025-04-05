import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AuthMode } from '@/hooks/auth';

type ModeToggleProps = {
  mode: AuthMode;
  toggleMode: () => void;
};

const ModeToggle = ({ mode, toggleMode }: ModeToggleProps) => {
  const getText = () => {
    if (mode === 'reset') {
      return "Remember your password?";
    }
    return mode === 'signin' ? "Don't have an account?" : "Already have an account?";
  };
  
  const getButtonText = () => {
    if (mode === 'reset') {
      return 'Back to Sign In';
    }
    return mode === 'signin' ? 'Sign up' : 'Sign in';
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <Separator />
      <div className="text-center text-sm">
        {getText()}
        <Button variant="link" onClick={toggleMode} className="px-2 py-0">
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default ModeToggle;
