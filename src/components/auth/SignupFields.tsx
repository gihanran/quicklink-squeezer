
import { User, Users, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type SignupFieldsProps = {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  whatsAppNumber: string;
  setWhatsAppNumber: (value: string) => void;
  disabled?: boolean;
};

const SignupFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  whatsAppNumber,
  setWhatsAppNumber,
  disabled
}: SignupFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="pl-10"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <div className="relative">
          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="pl-10"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsAppNumber">WhatsApp Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="whatsAppNumber"
            value={whatsAppNumber}
            onChange={(e) => setWhatsAppNumber(e.target.value)}
            placeholder="+1234567890"
            className="pl-10"
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
};

export default SignupFields;
