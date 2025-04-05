
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { User } from "@supabase/supabase-js";

interface PersonalInfoCardProps {
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  country: string;
  loading: boolean;
  mandatoryFieldsComplete: boolean;
  user: User | null;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setWhatsappNumber: (value: string) => void;
  setCountry: (value: string) => void;
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
  setFirstName,
  setLastName,
  setWhatsappNumber,
  setCountry,
  saveProfile
}: PersonalInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          <UserAvatar firstName={firstName} lastName={lastName} />
        </div>
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">User ID</p>
          <p className="font-mono text-xs">{user?.id}</p>
          <p className="text-xs text-gray-500 mt-1">
            Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Your first name"
            className={!firstName ? "border-red-300" : ""}
            required
          />
          {!firstName && (
            <p className="text-xs text-red-500">First name is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Your last name"
            className={!lastName ? "border-red-300" : ""}
            required
          />
          {!lastName && (
            <p className="text-xs text-red-500">Last name is required</p>
          )}
        </div>
        
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
        
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number <span className="text-red-500">*</span></Label>
          <Input
            id="whatsappNumber"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="Your WhatsApp number"
            className={!whatsappNumber ? "border-red-300" : ""}
            required
          />
          {!whatsappNumber && (
            <p className="text-xs text-red-500">WhatsApp number is required</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger 
              id="country" 
              className={!country ? "border-red-300" : ""}
            >
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
              <SelectItem value="Italy">Italy</SelectItem>
              <SelectItem value="Japan">Japan</SelectItem>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Brazil">Brazil</SelectItem>
              <SelectItem value="Mexico">Mexico</SelectItem>
              <SelectItem value="South Africa">South Africa</SelectItem>
              <SelectItem value="Nigeria">Nigeria</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {!country && (
            <p className="text-xs text-red-500">Country is required</p>
          )}
        </div>

        {!mandatoryFieldsComplete && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            <p className="font-medium">Complete your profile</p>
            <p className="text-xs mt-1">Please complete all required fields to enable link creation.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveProfile} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
