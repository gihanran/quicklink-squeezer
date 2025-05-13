
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UrlUnlocker } from "./types";

// Helper function to transform DB data to UrlUnlocker type
export const transformUnlockerData = (data: any): UrlUnlocker => ({
  id: data.id,
  userId: data.user_id,
  sequence: data.sequence,
  destinationUrl: data.destination_url,
  title: data.title,
  clicks: data.clicks,
  unlocks: data.unlocks,
  createdAt: new Date(data.created_at).getTime(),
  updatedAt: new Date(data.updated_at).getTime(),
  expirationDate: new Date(data.expiration_date).getTime(),
});

// Helper function to check if user is authenticated
export const checkAuthentication = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this feature",
      variant: "destructive"
    });
    return null;
  }
  return session.user.id;
};

// Helper function to handle errors
export const handleError = (error: any, title: string): null => {
  console.error(`Error: ${title}`, error);
  toast({
    title: title,
    description: error.message || "Please try again later",
    variant: "destructive"
  });
  return null;
};
