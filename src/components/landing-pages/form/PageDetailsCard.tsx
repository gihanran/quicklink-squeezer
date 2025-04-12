
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageDetailsForm from './PageDetailsForm';
import FormFooter from './FormFooter';
import { LandingPage } from "@/types/landingPage";

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
  themeColor: string;
  setThemeColor: (value: string) => void;
  uploading: boolean;
  error: string | null;
  handleProfileImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  themeColor,
  setThemeColor,
  uploading,
  error,
  handleProfileImageUpload,
  handleSave,
  saving,
  onCancel
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Details</CardTitle>
        <CardDescription>
          Configure how your landing page will appear to visitors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PageDetailsForm
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
          handleTitleChange={setTitle}
          handleDescriptionChange={setDescription}
        />
      </CardContent>
      <CardFooter>
        <FormFooter 
          onCancel={onCancel} 
          onSave={handleSave} 
          saving={saving} 
          disabled={!title || !slug} 
        />
      </CardFooter>
    </Card>
  );
};

export default PageDetailsCard;
