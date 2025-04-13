
import React from 'react';
import { useFormContext } from './FormContext';
import FormHeader from './FormHeader';
import PageDetailsCard from './PageDetailsCard';
import LinksCard from './LinksCard';
import PageAnalytics from './PageAnalytics';

const FormLayout: React.FC = () => {
  const {
    page,
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
    handleReorderLinks,
    onDeleteLink,
    onBack
  } = useFormContext();

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
        <>
          {page && page.id && <PageAnalytics page={page as LandingPage} links={localLinks} />}
          
          <LinksCard 
            links={localLinks}
            onAddLink={handleAddLink}
            onDeleteLink={onDeleteLink}
            onReorderLinks={handleReorderLinks}
            error={error}
          />
        </>
      )}
    </div>
  );
};

export default FormLayout;
