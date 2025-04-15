
import React from "react";
import { useFormContext } from "./FormContext";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import PageDetailsCard from "./PageDetailsCard";
import LinksCard from "./LinksCard";
import PageAnalytics from "./PageAnalytics";
import SocialMediaLinksCard from "@/components/bio-card/form/SocialMediaLinksCard";
import AppearanceCard from "@/components/bio-card/form/AppearanceCard";

const FormLayout: React.FC = () => {
  const {
    page,
    links,
    formState: {
      title,
      description,
      slug,
      published,
      profileImageUrl,
      backgroundImageUrl,
      themeColor,
      buttonStyle,
      socialLinks,
      saving,
      uploading,
      error,
    },
    handlers: {
      setTitle,
      setDescription,
      setSlug,
      setPublished,
      setThemeColor,
      setButtonStyle,
      setSocialLinks,
      handleProfileImageUpload,
      handleBackgroundImageUpload,
      handleSave,
      handleAddLink,
      handleReorderLinks
    }
  } = useFormContext();

  return (
    <div className="space-y-6">
      <FormHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <PageDetailsCard
            title={title}
            description={description}
            slug={slug}
            published={published}
            profileImageUrl={profileImageUrl}
            setTitle={setTitle}
            setDescription={setDescription}
            setSlug={setSlug}
            setPublished={setPublished}
            handleProfileImageUpload={handleProfileImageUpload}
            uploading={uploading}
            error={error}
          />

          <AppearanceCard
            backgroundImageUrl={backgroundImageUrl}
            themeColor={themeColor}
            buttonStyle={buttonStyle}
            onBackgroundImageChange={(url) => page?.id && url !== undefined ? setBackgroundImageUrl(url) : null}
            onThemeColorChange={setThemeColor}
            onButtonStyleChange={setButtonStyle}
            handleBackgroundImageUpload={handleBackgroundImageUpload}
            uploading={uploading}
          />
          
          {page?.id && (
            <>
              <SocialMediaLinksCard 
                socialLinks={socialLinks || []} 
                onSocialLinksChange={setSocialLinks} 
              />
              
              <LinksCard
                pageId={page.id}
                links={links}
                onAddLink={handleAddLink}
                onUpdateOrder={handleReorderLinks}
              />
            </>
          )}
        </div>

        <div className="md:col-span-1 space-y-6">
          {page?.id && <PageAnalytics page={page} links={links} />}
        </div>
      </div>

      <FormFooter saving={saving} onSave={handleSave} />
    </div>
  );
};

export default FormLayout;
