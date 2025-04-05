
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

export const NameFields: React.FC<NameFieldsProps> = ({
  firstName,
  lastName,
  setFirstName,
  setLastName
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Your first name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Your last name"
        />
      </div>
    </>
  );
};
