
import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type CountrySelectorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const CountrySelector = ({ value, onChange, disabled }: CountrySelectorProps) => {
  const countries = [
    { code: "", name: "Select a country" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "BR", name: "Brazil" },
    { code: "ZA", name: "South Africa" },
    { code: "NG", name: "Nigeria" },
    { code: "MX", name: "Mexico" },
    { code: "AR", name: "Argentina" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "NL", name: "Netherlands" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-2">
      <Label htmlFor="country">Country</Label>
      <div className="relative">
        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger id="country" className="w-full pl-10">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CountrySelector;
