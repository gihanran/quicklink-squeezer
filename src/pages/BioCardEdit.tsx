
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BioCardForm from '@/components/biocard/BioCardForm';
import { useToast } from '@/hooks/use-toast';
import { BioCard } from '@/types/bioCardTypes';
import { useAuthState } from '@/hooks/auth';
import { Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const BioCardEdit: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [bioCard, setBioCard] = useState<BioCard | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, signOut } = useAuthState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const fetchBioCard = async () => {
      if (!user || !slug) return;
      
      try {
        setLoading(true);
        
        // Fetch the bio card
        const { data, error } = await (supabase as any)
          .from('bio_cards')
          .select('*, links:bio_card_links(*), social_links:bio_card_social_links(*)')
          .eq('slug', slug)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          toast({
            title: 'Bio card not found',
            description: 'The requested bio card could not be found',
            variant: 'destructive'
          });
          navigate('/biocard');
          return;
        }
        
        setBioCard(data);
      } catch (error: any) {
        console.error('Error fetching bio card:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bio card',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBioCard();
  }, [slug, user, toast, navigate]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader handleLogout={handleLogout} user={user} />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/biocard')}
            className="text-primary hover:underline flex items-center"
          >
            ← Back to Bio Cards
          </button>
        </div>
        
        {bioCard && (
          <BioCardForm 
            onClose={() => navigate('/biocard')} 
            onSave={() => navigate('/biocard')} 
            initialData={bioCard} 
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BioCardEdit;
