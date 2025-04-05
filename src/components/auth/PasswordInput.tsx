
import { Key, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuthMode } from '@/hooks/auth';

type PasswordInputProps = {
  password: string;
  setPassword: (password: string) => void;
  mode: AuthMode;
  switchToResetMode: () => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  disabled?: boolean;
};

const PasswordInput = ({ 
  password, 
  setPassword, 
  mode, 
  switchToResetMode,
  showPassword,
  toggleShowPassword,
  disabled 
}: PasswordInputProps) => {
  return (
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="pl-10 pr-10"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1 h-8 w-8"
          onClick={toggleShowPassword}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PasswordInput;
