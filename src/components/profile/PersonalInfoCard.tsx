
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { ProfileAvatar } from "./personal-info/ProfileAvatar";
import { UserIdentity } from "./personal-info/UserIdentity";
import { NameFields } from "./personal-info/NameFields";
import { EmailField } from "./personal-info/EmailField";
import { WhatsAppField } from "./personal-info/WhatsAppField";
import { CountrySelector } from "./personal-info/CountrySelector";
import { SaveButton } from "./personal-info/SaveButton";

interface PersonalInfoCardProps {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  loading: boolean;
  mandatoryFieldsComplete: boolean;
  user: User | null;
  avatarUrl?: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setWhatsappNumber: (value: string) => void;
  setCountry: (value: string) => void;
  setAvatarUrl: (value: string) => void;
  saveProfile: () => Promise<void>;
}

export const PersonalInfoCard = ({
  firstName,
  lastName,
  email,
  whatsappNumber,
  country,
  loading,
  mandatoryFieldsComplete,
  user,
  avatarUrl,
  setFirstName,
  setLastName,
  setWhatsappNumber,
  setCountry,
  setAvatarUrl,
  saveProfile
}: PersonalInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details (optional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileAvatar 
          firstName={firstName}
          lastName={lastName}
          avatarUrl={avatarUrl}
          user={user}
          onAvatarChange={setAvatarUrl}
        />
        
        <UserIdentity user={user} />
        
        <NameFields
          firstName={firstName}
          lastName={lastName}
          setFirstName={setFirstName}
          setLastName={setLastName}
        />
        
        <EmailField email={email} />
        
        <WhatsAppField
          whatsappNumber={whatsappNumber}
          setWhatsappNumber={setWhatsappNumber}
        />
        
        <CountrySelector
          country={country}
          setCountry={setCountry}
        />
      </CardContent>
      <CardFooter>
        <SaveButton
          loading={loading}
          onClick={saveProfile}
        />
      </CardFooter>
    </Card>
  );
};
