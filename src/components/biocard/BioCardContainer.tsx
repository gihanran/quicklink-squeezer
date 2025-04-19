
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import BioCardHeader from './BioCardHeader';
import BioCardList from './BioCardList';
import BioCardForm from './BioCardForm';
import BioCardStats from './BioCardStats';
import { useBioCardData } from '@/hooks/useBioCardData';

const BioCardContainer: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { bioCards, stats, loading, fetchBioCards, handleDeleteCard } = useBioCardData();
  const { toast } = useToast();

  const handleCreateNewCard = () => {
    setShowCreateForm(true);
  };

  const handleCardCreated = () => {
    setShowCreateForm(false);
    fetchBioCards();
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
