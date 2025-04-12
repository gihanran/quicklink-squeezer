
import React from 'react';
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import LandingPageFormContainer from './form/LandingPageFormContainer';

interface LandingPageFormProps {
  page: Partial<LandingPage> | null;
  links: LandingPageLink[];
  onSave: (page: Partial<LandingPage>) => Promise<LandingPage | null>;
  onAddLink: (link: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onUpdateLink: (id: string, updates: Partial<LandingPageLink>) => Promise<LandingPageLink | null>;
  onDeleteLink: (id: string) => Promise<boolean>;
  onUpdateLinkOrder: (links: LandingPageLink[]) => Promise<boolean>;
  onBack: () => void;
}

const LandingPageForm: React.FC<LandingPageFormProps> = (props) => {
  return <LandingPageFormContainer {...props} />;
};

export default LandingPageForm;
