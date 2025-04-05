
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";

export const useProfileData = () => {
  const { user } = useAuthState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const { toast } = useToast();

  const mandatoryFieldsComplete = firstName && lastName && whatsappNumber && country && !whatsappError;

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      fetchProfile();
    }
  }, [user]);

  const validateWhatsappNumber = (number: string) => {
    // Basic phone number validation
    // Allow +, digits, spaces, dashes, and parentheses
    // Must have at least 10 digits (excluding formatting characters)
    const digits = number.replace(/\D/g, '');
    if (number && digits.length < 10) {
      setWhatsappError("WhatsApp number must contain at least 10 digits");
      return false;
    }
    
    // Check for valid format with regex
    // Allow for international format or regular format
    const phoneRegex = /^(\+?\d{1,4}[-\s]?)?(\(?\d{1,4}\)?[-\s]?)?(\d{1,4}[-\s]?){1,3}\d{1,4}$/;
    if (number && !phoneRegex.test(number)) {
      setWhatsappError("Please enter a valid phone number format");
      return false;
    }
    
    setWhatsappError(null);
    return true;
  };

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setWhatsappNumber(data.whatsapp_number || "");
        setCountry(data.country || "");
        setAvatarUrl(data.avatar_url || undefined);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile information",
        variant: "destructive"
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    // Validate WhatsApp number before saving
    if (!validateWhatsappNumber(whatsappNumber)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          whatsapp_number: whatsappNumber,
          country: country,
          full_name: `${firstName} ${lastName}`.trim(),
          has_completed_profile: Boolean(mandatoryFieldsComplete),
          updated_at: new Date().toISOString(),
          avatar_url: avatarUrl
        });

      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    firstName,
    lastName,
    email,
    whatsappNumber,
    country,
    avatarUrl,
    loading,
    profileLoading,
    mandatoryFieldsComplete,
    whatsappError,
    setFirstName,
    setLastName,
    setWhatsappNumber,
    setCountry,
    setAvatarUrl,
    saveProfile,
    validateWhatsappNumber,
    user
  };
};
