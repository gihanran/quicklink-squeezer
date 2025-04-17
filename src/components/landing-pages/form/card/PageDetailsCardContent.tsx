
import React from 'react';
import { CardContent } from "@/components/ui/card";
import PageDetailsForm from '../PageDetailsForm';
import { LandingPage } from "@/types/landingPage";

interface PageDetailsCardContentProps {
  page: Partial<LandingPage> | null;
  title: string;
  description: string;
  slug: string;
  published: boolean;
  profileImageUrl: string;
  backgroundImageUrl: string;
  backgroundOverlay: number;
  uploading: boolean;
  error: string | null;
  setTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setDescription: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setSlug: (value: string) => void;
  setPublished: (value: boolean) => void;
  setBackgroundOverlay: (value: number) => void;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const PageDetailsCardContent: React.FC<PageDetailsCardContentProps> = ({
  page,
  title,
  description,
  slug,
  published,
  profileImageUrl,
  backgroundImageUrl,
  backgroundOverlay,
  uploading,
  error,
  setTitle,
  setDescription,
  setSlug,
  setPublished,
  setBackgroundOverlay,
  handleProfileImageUpload,
  handleBackgroundImageUpload,
  handleTitleChange,
  handleDescriptionChange,
}) => {
  return (
    <CardContent>
      <PageDetailsForm
        page={page}
        title={title}
        description={description}
        slug={slug}
        published={published}
        profileImageUrl={profileImageUrl}
        backgroundImageUrl={backgroundImageUrl}
        backgroundOverlay={backgroundOverlay}
        uploading={uploading}
        error={error}
        handleProfileImageUpload={handleProfileImageUpload}
        handleBackgroundImageUpload={handleBackgroundImageUpload}
        handleTitleChange={handleTitleChange}
        handleDescriptionChange={handleDescriptionChange}
        setTitle={setTitle}
        setDescription={setDescription}
        setSlug={setSlug}
        setPublished={setPublished}
        setBackgroundOverlay={setBackgroundOverlay}
      />
    </CardContent>
  );
};

export default PageDetailsCardContent;
