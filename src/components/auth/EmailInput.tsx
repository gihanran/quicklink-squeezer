
import { AtSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type EmailInputProps = {
  email: string;
  setEmail: (email: string) => void;
  disabled?: boolean;
};

const EmailInput = ({ email, setEmail, disabled }: EmailInputProps) => {
  return (
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
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EmailInput;
