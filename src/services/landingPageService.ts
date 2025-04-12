
import { supabase } from "@/integrations/supabase/client";
import { CreateLandingPageData, LandingPage } from "@/types/landingPage";

export const fetchLandingPages = async (): Promise<LandingPage[]> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getLandingPageById = async (id: string): Promise<LandingPage> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createLandingPage = async (pageData: CreateLandingPageData): Promise<LandingPage> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .insert(pageData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateLandingPage = async (id: string, updates: Partial<LandingPage>): Promise<LandingPage> => {
  const { data, error } = await supabase
    .from('landing_pages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteLandingPage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('landing_pages')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/landing-pages/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('landing_pages')
    .upload(fileName, file, { upsert: true });
  
  if (uploadError) throw uploadError;
  
  const { data } = supabase.storage
    .from('landing_pages')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
};
