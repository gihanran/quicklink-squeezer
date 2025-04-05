
import { Button } from '@/components/ui/button';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '@/hooks/auth/adminUtils';

type DebugInfoSectionProps = {
  email: string;
  password: string;
  showDebugInfo: boolean;
  toggleDebugInfo: () => void;
};

const DebugInfoSection = ({
  email,
  password,
  showDebugInfo,
  toggleDebugInfo
}: DebugInfoSectionProps) => {
  return (
    <div className="mt-4">
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        className="text-xs" 
        onClick={toggleDebugInfo}
      >
        {showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info'}
      </Button>
      
      {showDebugInfo && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Password:</strong> {password ? '*'.repeat(password.length) : 'empty'}</p>
          <p className="text-xs text-gray-500 mt-1">
            Admin credentials: {ADMIN_EMAIL} / {ADMIN_PASSWORD}
          </p>
        </div>
      )}
    </div>
  );
};

export default DebugInfoSection;
