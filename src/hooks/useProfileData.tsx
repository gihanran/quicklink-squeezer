
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
  const { toast } = useToast();

  // Ensure mandatoryFieldsComplete returns a boolean value
  const mandatoryFieldsComplete = Boolean(firstName && lastName && country);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setProfileLoading(true);
      console.log("Fetching profile for user:", user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log("Profile data received:", data);
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
    if (!user) {
      console.error("Cannot save profile: No user logged in");
      return;
    }
    
    if (!firstName || !lastName || !country) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Saving profile for user:", user.id);
      console.log("Profile data to save:", {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        whatsapp_number: whatsappNumber,
        country: country,
        full_name: `${firstName} ${lastName}`.trim(),
        avatar_url: avatarUrl
      });
      
      // Make sure we're properly handling the row-level security by explicitly setting the id
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id, // Make sure this matches the authenticated user's ID
          first_name: firstName,
          last_name: lastName,
          email: email,
          whatsapp_number: whatsappNumber,
          country: country,
          full_name: `${firstName} ${lastName}`.trim(),
          has_completed_profile: true,
          updated_at: new Date().toISOString(),
          avatar_url: avatarUrl
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      console.log("Profile updated successfully");
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile",
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
    setFirstName,
    setLastName,
    setWhatsappNumber,
    setCountry,
    setAvatarUrl,
    saveProfile,
    user
  };
};
