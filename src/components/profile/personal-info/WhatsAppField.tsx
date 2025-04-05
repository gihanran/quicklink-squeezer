
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WhatsAppFieldProps {
  whatsappNumber: string;
  setWhatsappNumber: (value: string) => void;
}

export const WhatsAppField: React.FC<WhatsAppFieldProps> = ({
  whatsappNumber,
  setWhatsappNumber
}) => {
  return (
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
  );
};
