
import React from "react";
import { useFormContext } from "./FormContext";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import PageDetailsCard from "./PageDetailsCard";
import LinksCard from "./LinksCard";
import PageAnalytics from "./PageAnalytics";

const FormLayout: React.FC = () => {
  const {
    page,
    title,
    description,
    slug,
    published,
    profileImageUrl,
    backgroundImageUrl,
    backgroundOverlay,
    saving,
    uploading,
    error,
    localLinks: links,
    isEditing,
    setTitle,
    setDescription,
    setSlug,
    setPublished,
    setBackgroundOverlay,
    handleProfileImageUpload,
    handleBackgroundImageUpload,
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PageDetailsCard
            page={page}
            title={title}
            description={description}
            slug={slug}
            published={published}
            profileImageUrl={profileImageUrl}
            backgroundImageUrl={backgroundImageUrl}
            backgroundOverlay={backgroundOverlay}
            setTitle={setTitle}
            setDescription={setDescription}
            setSlug={setSlug}
            setPublished={setPublished}
            setBackgroundOverlay={setBackgroundOverlay}
            handleProfileImageUpload={handleProfileImageUpload}
            handleBackgroundImageUpload={handleBackgroundImageUpload}
            handleSave={handleSave}
            saving={saving}
            uploading={uploading}
            error={error}
            onCancel={onBack}
          />
          
          {page?.id && (
            <LinksCard
              links={links}
              onAddLink={handleAddLink}
              onDeleteLink={onDeleteLink}
              onReorderLinks={handleReorderLinks}
              error={error}
            />
          )}
        </div>

        <div className="md:col-span-1 space-y-6">
          {page?.id && <PageAnalytics page={page as any} links={links} />}
        </div>
      </div>

      <FormFooter 
        saving={saving} 
        onSave={handleSave} 
        onCancel={onBack}
        disabled={!title || !slug}
      />
    </div>
  );
};

export default FormLayout;
