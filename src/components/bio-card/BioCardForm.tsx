
import React from 'react';
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import BioCardFormContainer from './form/BioCardFormContainer';

interface BioCardFormProps {
  page: Partial<LandingPage> | null;
  links: LandingPageLink[];
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLink: (id: string, updates: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onDeleteLink: (id: string) => Promise<boolean>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
  onBack: () => void;
}

const BioCardForm: React.FC<BioCardFormProps> = (props) => {
  return <BioCardFormContainer {...props} />;
};

export default BioCardForm;
