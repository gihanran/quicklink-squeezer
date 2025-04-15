
import React, { useState, useEffect } from 'react';
import { useAuthState } from "@/hooks/auth";
import { MagicButton } from "@/types/magicButton";
import { getMagicButtons, getUserMagicButtonCount } from "@/services/magicButtonService";
import MagicButtonForm from "./MagicButtonForm";
import MagicButtonsList from "./MagicButtonsList";
import MagicButtonHeader from "./MagicButtonHeader";
import MagicButtonDialogs from "./MagicButtonDialogs";

const MagicButtonsSection: React.FC = () => {
  const { user } = useAuthState();
  const [magicButtons, setMagicButtons] = useState<MagicButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedButton, setSelectedButton] = useState<MagicButton | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buttonCount, setButtonCount] = useState(0);
  
  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    const buttons = await getMagicButtons();
    const { count } = await getUserMagicButtonCount(user.id);
    
    setMagicButtons(buttons);
    setButtonCount(count);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, [user]);
  
  const handleCreateNewButton = () => {
    setShowCreateForm(true);
  };
  
  const handleButtonCreated = () => {
    setShowCreateForm(false);
    fetchData();
  };
  
  const handleEditButton = (button: MagicButton) => {
    setSelectedButton(button);
    setEditDialogOpen(true);
  };
  
  const handleDeleteButton = (button: MagicButton) => {
    setSelectedButton(button);
    setDeleteDialogOpen(true);
  };
  
  const handleUpdateCompleted = () => {
    setEditDialogOpen(false);
    fetchData();
  };
  
  const handleDeleteCompleted = () => {
    setDeleteDialogOpen(false);
    fetchData();
  };
  
  return (
    <div className="space-y-6">
      <MagicButtonHeader 
        handleCreateNewButton={handleCreateNewButton} 
        buttonCount={buttonCount}
      />
      
      {showCreateForm && (
        <MagicButtonForm 
          onComplete={handleButtonCreated} 
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      
      <MagicButtonsList 
        magicButtons={magicButtons} 
        loading={loading}
        onEdit={handleEditButton}
        onDelete={handleDeleteButton}
        handleCreateNewButton={handleCreateNewButton}
      />
      
      <MagicButtonDialogs 
        selectedButton={selectedButton}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onUpdateComplete={handleUpdateCompleted}
        onDeleteComplete={handleDeleteCompleted}
      />
    </div>
  );
};

export default MagicButtonsSection;
