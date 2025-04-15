
import React from 'react';
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import FormLayout from './FormLayout';
import { FormProvider } from '@/components/landing-pages/form/FormContext';

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

const BioCardFormContainer: React.FC<BioCardFormProps> = ({
  page,
  links,
  onSave,
  onAddLink,
  onUpdateLink,
  onDeleteLink,
  onUpdateLinkOrder,
  onBack
}) => {
  return (
    <FormProvider
      page={page}
      links={links}
      onSave={onSave}
      onAddLink={onAddLink}
      onDeleteLink={onDeleteLink}
      onUpdateLinkOrder={onUpdateLinkOrder}
      onBack={onBack}
    >
      <FormLayout />
    </FormProvider>
  );
};

export default BioCardFormContainer;
