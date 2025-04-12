
import React from 'react';
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import PageDetailsCard from './PageDetailsCard';
import LinksCard from './LinksCard';
import FormHeader from './FormHeader';
import { useLandingPageForm } from '@/hooks/useLandingPageForm';

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

const LandingPageFormContainer: React.FC<LandingPageFormProps> = ({
  page,
  links,
  onSave,
  onAddLink,
  onDeleteLink,
  onUpdateLinkOrder,
  onBack
}) => {
  const {
    title,
    description,
    slug,
    published,
    profileImageUrl,
    themeColor,
    saving,
    uploading,
    error,
    localLinks,
    isEditing,
    setTitle,
    setDescription,
    setSlug,
    setPublished,
    setThemeColor,
    handleProfileImageUpload,
    handleSave,
    handleAddLink,
    handleReorderLinks
  } = useLandingPageForm({
    page,
    links,
    onSave,
    onAddLink,
    onUpdateLinkOrder
  });

  return (
    <div className="space-y-6">
      <FormHeader 
        isEditing={isEditing} 
        error={error} 
        onBack={onBack} 
      />

      <PageDetailsCard 
        page={page}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        slug={slug}
        setSlug={setSlug}
        published={published}
        setPublished={setPublished}
        profileImageUrl={profileImageUrl}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        uploading={uploading}
        error={error}
        handleProfileImageUpload={handleProfileImageUpload}
        handleSave={handleSave}
        saving={saving}
        onCancel={onBack}
      />

      {isEditing && (
        <LinksCard 
          links={localLinks}
          onAddLink={handleAddLink}
          onDeleteLink={onDeleteLink}
          onReorderLinks={handleReorderLinks}
          error={error}
        />
      )}
    </div>
  );
};

export default LandingPageFormContainer;
