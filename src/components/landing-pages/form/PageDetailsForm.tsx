
import React from 'react';
import ProfileImageUpload from './profile/ProfileImageUpload';
import BackgroundImageUpload from './background/BackgroundImageUpload';
import PageDetailsFields from './fields/PageDetailsFields';
import { LandingPage } from "@/types/landingPage";

interface PageDetailsFormProps {
  page: Partial<LandingPage> | null;
  title: string;
  setTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
  setDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  slug: string;
  setSlug: (value: string) => void;
  published: boolean;
  setPublished: (value: boolean) => void;
  profileImageUrl: string;
  backgroundImageUrl: string;
  backgroundOverlay: number;
  uploading: boolean;
  error: string | null;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setBackgroundOverlay: (value: number) => void;
}

const PageDetailsForm: React.FC<PageDetailsFormProps> = ({
  page,
  title,
  description,
  slug,
  published,
  profileImageUrl,
  backgroundImageUrl,
  backgroundOverlay,
  uploading,
  handleTitleChange,
  handleDescriptionChange,
  handleProfileImageUpload,
  handleBackgroundImageUpload,
  setBackgroundOverlay,
  setPublished,
  setSlug,
}) => {
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  return (
    <div className="space-y-4">
      <ProfileImageUpload
        title={title}
        profileImageUrl={profileImageUrl}
        uploading={uploading}
        handleProfileImageUpload={handleProfileImageUpload}
      />

      <PageDetailsFields
        title={title}
        description={description}
        slug={slug}
        published={published}
        handleTitleChange={handleTitleChange}
        handleDescriptionChange={handleDescriptionChange}
        handleSlugChange={handleSlugChange}
        setPublished={setPublished}
      />

      <BackgroundImageUpload
        backgroundImageUrl={backgroundImageUrl}
        backgroundOverlay={backgroundOverlay}
        uploading={uploading}
        handleBackgroundImageUpload={handleBackgroundImageUpload}
        setBackgroundOverlay={setBackgroundOverlay}
      />
    </div>
  );
};

export default PageDetailsForm;
