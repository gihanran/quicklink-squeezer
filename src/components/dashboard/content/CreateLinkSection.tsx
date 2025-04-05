
import React from 'react';
import CreateLinkCard from "../CreateLinkCard";

interface CreateLinkSectionProps {
  showCreateForm: boolean;
  handleLinkCreated: () => void;
  handleUrlShortened: () => void;
}

const CreateLinkSection: React.FC<CreateLinkSectionProps> = ({
  showCreateForm,
  handleLinkCreated,
  handleUrlShortened
}) => {
  if (!showCreateForm) return null;
  
  return (
    <CreateLinkCard 
      handleLinkCreated={handleLinkCreated} 
      handleUrlShortened={handleUrlShortened} 
    />
  );
};

export default CreateLinkSection;
