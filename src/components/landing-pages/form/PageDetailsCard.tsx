
import React from 'react';
import { Card } from "@/components/ui/card";
import { LandingPage } from "@/types/landingPage";
import PageDetailsCardHeader from './card/PageDetailsCardHeader';
import PageDetailsCardContent from './card/PageDetailsCardContent';
import PageDetailsCardFooter from './card/PageDetailsCardFooter';

interface PageDetailsCardProps {
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
  setBackgroundOverlay: (value: number) => void;
  handleSave: () => void;
  saving: boolean;
  onCancel: () => void;
}

const PageDetailsCard: React.FC<PageDetailsCardProps> = ({
  page,
  title,
  setTitle,
  description,
  setDescription,
  slug,
  setSlug,
  published,
  setPublished,
  profileImageUrl,
  backgroundImageUrl,
  backgroundOverlay,
  uploading,
  error,
  handleProfileImageUpload,
  handleBackgroundImageUpload,
  setBackgroundOverlay,
  handleSave,
  saving,
  onCancel
}) => {
  return (
    <Card>
      <PageDetailsCardHeader />
      <PageDetailsCardContent
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
        setTitle={setTitle}
        setDescription={setDescription}
        setSlug={setSlug}
        setPublished={setPublished}
        setBackgroundOverlay={setBackgroundOverlay}
        handleProfileImageUpload={handleProfileImageUpload}
        handleBackgroundImageUpload={handleBackgroundImageUpload}
        handleTitleChange={setTitle}
        handleDescriptionChange={setDescription}
      />
      <PageDetailsCardFooter
        onCancel={onCancel}
        onSave={handleSave}
        saving={saving}
        title={title}
        slug={slug}
      />
    </Card>
  );
};

export default PageDetailsCard;
