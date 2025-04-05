
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
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          <UserAvatar 
            firstName={firstName} 
            lastName={lastName} 
            imageUrl={avatarUrl}
            user={user}
            editable={true}
            onAvatarChange={setAvatarUrl}
          />
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
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="Your WhatsApp number (optional)"
          />
          <p className="text-xs text-gray-500">Include country code for international numbers (e.g., +1 for US)</p>
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
            <SelectContent className="max-h-80">
              <SelectItem value="Afghanistan">Afghanistan</SelectItem>
              <SelectItem value="Albania">Albania</SelectItem>
              <SelectItem value="Algeria">Algeria</SelectItem>
              <SelectItem value="Andorra">Andorra</SelectItem>
              <SelectItem value="Angola">Angola</SelectItem>
              <SelectItem value="Antigua and Barbuda">Antigua and Barbuda</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Armenia">Armenia</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Austria">Austria</SelectItem>
              <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
              <SelectItem value="Bahamas">Bahamas</SelectItem>
              <SelectItem value="Bahrain">Bahrain</SelectItem>
              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
              <SelectItem value="Barbados">Barbados</SelectItem>
              <SelectItem value="Belarus">Belarus</SelectItem>
              <SelectItem value="Belgium">Belgium</SelectItem>
              <SelectItem value="Belize">Belize</SelectItem>
              <SelectItem value="Benin">Benin</SelectItem>
              <SelectItem value="Bhutan">Bhutan</SelectItem>
              <SelectItem value="Bolivia">Bolivia</SelectItem>
              <SelectItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</SelectItem>
              <SelectItem value="Botswana">Botswana</SelectItem>
              <SelectItem value="Brazil">Brazil</SelectItem>
              <SelectItem value="Brunei">Brunei</SelectItem>
              <SelectItem value="Bulgaria">Bulgaria</SelectItem>
              <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
              <SelectItem value="Burundi">Burundi</SelectItem>
              <SelectItem value="Cabo Verde">Cabo Verde</SelectItem>
              <SelectItem value="Cambodia">Cambodia</SelectItem>
              <SelectItem value="Cameroon">Cameroon</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="Central African Republic">Central African Republic</SelectItem>
              <SelectItem value="Chad">Chad</SelectItem>
              <SelectItem value="Chile">Chile</SelectItem>
              <SelectItem value="China">China</SelectItem>
              <SelectItem value="Colombia">Colombia</SelectItem>
              <SelectItem value="Comoros">Comoros</SelectItem>
              <SelectItem value="Congo">Congo</SelectItem>
              <SelectItem value="Costa Rica">Costa Rica</SelectItem>
              <SelectItem value="Croatia">Croatia</SelectItem>
              <SelectItem value="Cuba">Cuba</SelectItem>
              <SelectItem value="Cyprus">Cyprus</SelectItem>
              <SelectItem value="Czech Republic">Czech Republic</SelectItem>
              <SelectItem value="Denmark">Denmark</SelectItem>
              <SelectItem value="Djibouti">Djibouti</SelectItem>
              <SelectItem value="Dominica">Dominica</SelectItem>
              <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
              <SelectItem value="East Timor">East Timor</SelectItem>
              <SelectItem value="Ecuador">Ecuador</SelectItem>
              <SelectItem value="Egypt">Egypt</SelectItem>
              <SelectItem value="El Salvador">El Salvador</SelectItem>
              <SelectItem value="Equatorial Guinea">Equatorial Guinea</SelectItem>
              <SelectItem value="Eritrea">Eritrea</SelectItem>
              <SelectItem value="Estonia">Estonia</SelectItem>
              <SelectItem value="Eswatini">Eswatini</SelectItem>
              <SelectItem value="Ethiopia">Ethiopia</SelectItem>
              <SelectItem value="Fiji">Fiji</SelectItem>
              <SelectItem value="Finland">Finland</SelectItem>
              <SelectItem value="France">France</SelectItem>
              <SelectItem value="Gabon">Gabon</SelectItem>
              <SelectItem value="Gambia">Gambia</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Ghana">Ghana</SelectItem>
              <SelectItem value="Greece">Greece</SelectItem>
              <SelectItem value="Grenada">Grenada</SelectItem>
              <SelectItem value="Guatemala">Guatemala</SelectItem>
              <SelectItem value="Guinea">Guinea</SelectItem>
              <SelectItem value="Guinea-Bissau">Guinea-Bissau</SelectItem>
              <SelectItem value="Guyana">Guyana</SelectItem>
              <SelectItem value="Haiti">Haiti</SelectItem>
              <SelectItem value="Honduras">Honduras</SelectItem>
              <SelectItem value="Hungary">Hungary</SelectItem>
              <SelectItem value="Iceland">Iceland</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Indonesia">Indonesia</SelectItem>
              <SelectItem value="Iran">Iran</SelectItem>
              <SelectItem value="Iraq">Iraq</SelectItem>
              <SelectItem value="Ireland">Ireland</SelectItem>
              <SelectItem value="Israel">Israel</SelectItem>
              <SelectItem value="Italy">Italy</SelectItem>
              <SelectItem value="Jamaica">Jamaica</SelectItem>
              <SelectItem value="Japan">Japan</SelectItem>
              <SelectItem value="Jordan">Jordan</SelectItem>
              <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="Kiribati">Kiribati</SelectItem>
              <SelectItem value="Korea, North">Korea, North</SelectItem>
              <SelectItem value="Korea, South">Korea, South</SelectItem>
              <SelectItem value="Kosovo">Kosovo</SelectItem>
              <SelectItem value="Kuwait">Kuwait</SelectItem>
              <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
              <SelectItem value="Laos">Laos</SelectItem>
              <SelectItem value="Latvia">Latvia</SelectItem>
              <SelectItem value="Lebanon">Lebanon</SelectItem>
              <SelectItem value="Lesotho">Lesotho</SelectItem>
              <SelectItem value="Liberia">Liberia</SelectItem>
              <SelectItem value="Libya">Libya</SelectItem>
              <SelectItem value="Liechtenstein">Liechtenstein</SelectItem>
              <SelectItem value="Lithuania">Lithuania</SelectItem>
              <SelectItem value="Luxembourg">Luxembourg</SelectItem>
              <SelectItem value="Madagascar">Madagascar</SelectItem>
              <SelectItem value="Malawi">Malawi</SelectItem>
              <SelectItem value="Malaysia">Malaysia</SelectItem>
              <SelectItem value="Maldives">Maldives</SelectItem>
              <SelectItem value="Mali">Mali</SelectItem>
              <SelectItem value="Malta">Malta</SelectItem>
              <SelectItem value="Marshall Islands">Marshall Islands</SelectItem>
              <SelectItem value="Mauritania">Mauritania</SelectItem>
              <SelectItem value="Mauritius">Mauritius</SelectItem>
              <SelectItem value="Mexico">Mexico</SelectItem>
              <SelectItem value="Micronesia">Micronesia</SelectItem>
              <SelectItem value="Moldova">Moldova</SelectItem>
              <SelectItem value="Monaco">Monaco</SelectItem>
              <SelectItem value="Mongolia">Mongolia</SelectItem>
              <SelectItem value="Montenegro">Montenegro</SelectItem>
              <SelectItem value="Morocco">Morocco</SelectItem>
              <SelectItem value="Mozambique">Mozambique</SelectItem>
              <SelectItem value="Myanmar">Myanmar</SelectItem>
              <SelectItem value="Namibia">Namibia</SelectItem>
              <SelectItem value="Nauru">Nauru</SelectItem>
              <SelectItem value="Nepal">Nepal</SelectItem>
              <SelectItem value="Netherlands">Netherlands</SelectItem>
              <SelectItem value="New Zealand">New Zealand</SelectItem>
              <SelectItem value="Nicaragua">Nicaragua</SelectItem>
              <SelectItem value="Niger">Niger</SelectItem>
              <SelectItem value="Nigeria">Nigeria</SelectItem>
              <SelectItem value="North Macedonia">North Macedonia</SelectItem>
              <SelectItem value="Norway">Norway</SelectItem>
              <SelectItem value="Oman">Oman</SelectItem>
              <SelectItem value="Pakistan">Pakistan</SelectItem>
              <SelectItem value="Palau">Palau</SelectItem>
              <SelectItem value="Panama">Panama</SelectItem>
              <SelectItem value="Papua New Guinea">Papua New Guinea</SelectItem>
              <SelectItem value="Paraguay">Paraguay</SelectItem>
              <SelectItem value="Peru">Peru</SelectItem>
              <SelectItem value="Philippines">Philippines</SelectItem>
              <SelectItem value="Poland">Poland</SelectItem>
              <SelectItem value="Portugal">Portugal</SelectItem>
              <SelectItem value="Qatar">Qatar</SelectItem>
              <SelectItem value="Romania">Romania</SelectItem>
              <SelectItem value="Russia">Russia</SelectItem>
              <SelectItem value="Rwanda">Rwanda</SelectItem>
              <SelectItem value="Saint Kitts and Nevis">Saint Kitts and Nevis</SelectItem>
              <SelectItem value="Saint Lucia">Saint Lucia</SelectItem>
              <SelectItem value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</SelectItem>
              <SelectItem value="Samoa">Samoa</SelectItem>
              <SelectItem value="San Marino">San Marino</SelectItem>
              <SelectItem value="Sao Tome and Principe">Sao Tome and Principe</SelectItem>
              <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
              <SelectItem value="Senegal">Senegal</SelectItem>
              <SelectItem value="Serbia">Serbia</SelectItem>
              <SelectItem value="Seychelles">Seychelles</SelectItem>
              <SelectItem value="Sierra Leone">Sierra Leone</SelectItem>
              <SelectItem value="Singapore">Singapore</SelectItem>
              <SelectItem value="Slovakia">Slovakia</SelectItem>
              <SelectItem value="Slovenia">Slovenia</SelectItem>
              <SelectItem value="Solomon Islands">Solomon Islands</SelectItem>
              <SelectItem value="Somalia">Somalia</SelectItem>
              <SelectItem value="South Africa">South Africa</SelectItem>
              <SelectItem value="South Sudan">South Sudan</SelectItem>
              <SelectItem value="Spain">Spain</SelectItem>
              <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
              <SelectItem value="Sudan">Sudan</SelectItem>
              <SelectItem value="Suriname">Suriname</SelectItem>
              <SelectItem value="Sweden">Sweden</SelectItem>
              <SelectItem value="Switzerland">Switzerland</SelectItem>
              <SelectItem value="Syria">Syria</SelectItem>
              <SelectItem value="Taiwan">Taiwan</SelectItem>
              <SelectItem value="Tajikistan">Tajikistan</SelectItem>
              <SelectItem value="Tanzania">Tanzania</SelectItem>
              <SelectItem value="Thailand">Thailand</SelectItem>
              <SelectItem value="Togo">Togo</SelectItem>
              <SelectItem value="Tonga">Tonga</SelectItem>
              <SelectItem value="Trinidad and Tobago">Trinidad and Tobago</SelectItem>
              <SelectItem value="Tunisia">Tunisia</SelectItem>
              <SelectItem value="Turkey">Turkey</SelectItem>
              <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
              <SelectItem value="Tuvalu">Tuvalu</SelectItem>
              <SelectItem value="Uganda">Uganda</SelectItem>
              <SelectItem value="Ukraine">Ukraine</SelectItem>
              <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Uruguay">Uruguay</SelectItem>
              <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
              <SelectItem value="Vanuatu">Vanuatu</SelectItem>
              <SelectItem value="Vatican City">Vatican City</SelectItem>
              <SelectItem value="Venezuela">Venezuela</SelectItem>
              <SelectItem value="Vietnam">Vietnam</SelectItem>
              <SelectItem value="Yemen">Yemen</SelectItem>
              <SelectItem value="Zambia">Zambia</SelectItem>
              <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
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
