
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AdminCredentialsButtonProps = {
  useAdminCredentials: () => void;
};

const AdminCredentialsButton = ({ useAdminCredentials }: AdminCredentialsButtonProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={useAdminCredentials}
      >
        <ShieldCheck className="h-4 w-4 text-brand-purple" />
        Use Admin Credentials
      </Button>
      <p className="text-xs text-center mt-2 text-gray-500">
        Use predefined admin access credentials
      </p>
    </div>
  );
};

export default AdminCredentialsButton;
