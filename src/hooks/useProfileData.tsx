
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
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const { toast } = useToast();

  const mandatoryFieldsComplete = firstName && lastName && whatsappNumber && country;

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      fetchProfile();
    }
  }, [user]);

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
          updated_at: new Date().toISOString()
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
    loading,
    profileLoading,
    mandatoryFieldsComplete,
    setFirstName,
    setLastName,
    setWhatsappNumber,
    setCountry,
    saveProfile,
    user
  };
};
