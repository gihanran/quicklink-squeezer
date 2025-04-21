
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { BioCard } from '@/types/bioCardTypes';
import BioCardItem from './components/BioCardItem';

interface BioCardListProps {
  bioCards: BioCard[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const BioCardList: React.FC<BioCardListProps> = ({ 
  bioCards, 
  loading,
  onDelete
}) => {
  const { toast } = useToast();

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/b/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ description: "Link copied to clipboard!" });
  };

  const togglePublishStatus = async (card: BioCard) => {
    try {
      const { error } = await supabase
        .from('bio_cards')
        .update({ published: !card.published })
        .eq('id', card.id);
      
      if (error) throw error;
      
      toast({ 
        description: card.published ? 
          "Bio card unpublished successfully" : 
          "Bio card published successfully" 
      });
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({ 
        variant: 'destructive',
        description: "Failed to update publish status" 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (bioCards.length === 0) {
    return (
      <Card className="my-12">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 rounded-full p-6 mb-4">
            <LinkIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-medium mb-2">No Bio Cards Yet</h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Create your first bio card to showcase your important links in one place
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-xl font-bold">Your Bio Cards</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bioCards.map((card) => (
          <BioCardItem
            key={card.id}
            card={card}
            onDelete={onDelete}
            onShare={handleCopyLink}
            onTogglePublish={togglePublishStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default BioCardList;
