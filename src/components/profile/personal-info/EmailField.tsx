
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  email: string;
}

export const EmailField: React.FC<EmailFieldProps> = ({ email }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        value={email}
        readOnly
        disabled
        className="bg-gray-50"
      />
      <p className="text-xs text-gray-500">To change your email, please contact support</p>
    </div>
  );
};
