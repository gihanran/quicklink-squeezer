
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/hooks/auth';
import type { BioCard, BioCardLink, BioCardSocialLink, ProfileWithBioCardLimit } from '@/types/bioCardTypes';

export const useBioCardData = () => {
  const [bioCards, setBioCards] = useState<BioCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCards: 0,
    totalViews: 0,
    totalClicks: 0,
    remainingCards: 0,
    cardLimit: 25
  });
  const { user } = useAuthState();
  const { toast } = useToast();

  // Fetch bio cards
  const fetchBioCards = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Use any type to bypass type checking for tables not in types.ts
      const { data, error } = await (supabase as any)
        .from('bio_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setBioCards(data || []);
      
      // Calculate stats
      const totalCards = data?.length || 0;
      let totalViews = 0;
      let totalClicks = 0;
      
      data?.forEach((card: BioCard) => {
        totalViews += card.views || 0;
        totalClicks += card.clicks || 0;
      });
      
      // Get user profile for limit
      const { data: profileData, error: profileError } = await (supabase as any)
        .from('profiles')
        .select('bio_card_limit')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.warn('Could not fetch bio card limit:', profileError);
      }
      
      const cardLimit = profileData?.bio_card_limit || 25;
      
      setStats({
        totalCards,
        totalViews, 
        totalClicks,
        remainingCards: cardLimit - totalCards,
        cardLimit
      });
      
    } catch (error: any) {
      console.error('Error fetching bio cards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bio cards',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchBioCards();
    }
  }, [user, fetchBioCards]);

  // Delete card function
  const handleDeleteCard = async (cardId: string) => {
    try {
      // Delete all links first
      await (supabase as any)
        .from('bio_card_links')
        .delete()
        .eq('bio_card_id', cardId);
        
      // Delete all social links
      await (supabase as any)
        .from('bio_card_social_links')
        .delete()
        .eq('bio_card_id', cardId);
        
      // Then delete the card
      const { error } = await (supabase as any)
        .from('bio_cards')
        .delete()
        .eq('id', cardId);
        
      if (error) throw error;
      
      toast({
        title: 'Bio Card Deleted',
        description: 'Your bio card has been deleted successfully',
      });
      
      fetchBioCards();
    } catch (error: any) {
      console.error('Error deleting bio card:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete bio card',
        variant: 'destructive'
      });
    }
  };

  return {
    bioCards,
    stats,
    loading,
    fetchBioCards,
    handleDeleteCard
  };
};
