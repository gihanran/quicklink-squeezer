
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/auth';
import BioCardHeader from './BioCardHeader';
import BioCardList from './BioCardList';
import BioCardForm from './BioCardForm';
import BioCardStats from './BioCardStats';

const BioCardContainer: React.FC = () => {
  const [bioCards, setBioCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCards: 0,
    totalViews: 0,
    totalClicks: 0,
    remainingCards: 0,
    cardLimit: 25
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuthState();
  const { toast } = useToast();

  // Fetch bio cards
  const fetchBioCards = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
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
      
      data?.forEach(card => {
        totalViews += card.views || 0;
        totalClicks += card.clicks || 0;
      });
      
      // Get user profile for limit
      const { data: profileData } = await supabase
        .from('profiles')
        .select('bio_card_limit')
        .eq('id', user.id)
        .single();
        
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
  };

  useEffect(() => {
    if (user) {
      fetchBioCards();
    }
  }, [user]);

  const handleCreateNewCard = () => {
    setShowCreateForm(true);
  };

  const handleCardCreated = () => {
    setShowCreateForm(false);
    fetchBioCards();
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      // Delete all links first
      await supabase
        .from('bio_card_links')
        .delete()
        .eq('bio_card_id', cardId);
        
      // Then delete the card
      const { error } = await supabase
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

  return (
    <div>
      <BioCardHeader 
        handleCreateNewCard={handleCreateNewCard} 
        remainingCards={stats.remainingCards} 
      />
      
      {showCreateForm && (
        <BioCardForm 
          onClose={() => setShowCreateForm(false)}
          onSave={handleCardCreated}
        />
      )}
      
      <BioCardStats stats={stats} />
      
      <BioCardList 
        bioCards={bioCards} 
        loading={loading} 
        onDelete={handleDeleteCard}
      />
    </div>
  );
};

export default BioCardContainer;
