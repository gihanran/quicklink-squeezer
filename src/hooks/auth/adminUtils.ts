
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Predefined admin email for direct checks
export const ADMIN_EMAIL = "admin@quicklink.com";

export async function checkAdminStatus(user: User | null): Promise<boolean> {
  if (!user) {
    console.log("No user found when checking admin status");
    return false;
  }
  
  try {
    console.log("🔍 Checking admin status for user:", user.id);
    console.log("🔍 User email:", user.email);
    
    // Special case for predefined admin
    if (user.email === ADMIN_EMAIL) {
      console.log("✅ Predefined admin account detected");
      return true;
    }
    
    // First, make sure we have the most up-to-date user data
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("❌ Error getting current user:", userError.message);
      return false;
    }
    
    if (!currentUser) {
      console.log("❌ No current user found in getUser call");
      return false;
    }
    
    console.log("✅ Current user from getUser:", currentUser);
    
    // Special case for predefined admin (double-check with current user)
    if (currentUser.email === ADMIN_EMAIL) {
      console.log("✅ Current user is predefined admin");
      return true;
    }
    
    // Direct query to profiles table with more detailed logging
    console.log("🔍 Querying profiles table for admin status with userId:", currentUser.id);
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin, email')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error("❌ Error checking admin status:", error.message);
      return false;
    }
    
    console.log("🔍 Admin check result:", data);
    
    // Extra check to ensure data exists
    if (!data) {
      console.log("❌ No profile found for user ID:", currentUser.id);
      
      // Let's try to insert a profile record if it doesn't exist
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: currentUser.id, email: currentUser.email, is_admin: false }])
        .select('is_admin')
        .maybeSingle();
        
      if (insertError) {
        console.error("❌ Error creating profile:", insertError.message);
        return false;
      }
      
      console.log("✅ Created new profile:", insertedProfile);
      return false;
    }
    
    // Explicitly check for true value
    const adminStatus = data.is_admin === true;
    console.log("✅ Setting admin status to:", adminStatus);
    return adminStatus;
  } catch (error) {
    console.error("❌ Exception during admin status check:", error);
    return false;
  }
}
