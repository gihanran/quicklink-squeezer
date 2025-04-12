
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LinksForm from './LinksForm';
import { LandingPageLink } from "@/types/landingPage";

interface LinksCardProps {
  links: LandingPageLink[];
  onAddLink: (link: { title: string, url: string }) => void;
  onDeleteLink: (id: string) => Promise<boolean>;
  onReorderLinks: (links: LandingPageLink[]) => Promise<void>;
  error: string | null;
}

const LinksCard: React.FC<LinksCardProps> = ({
  links,
  onAddLink,
  onDeleteLink,
  onReorderLinks,
  error
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Links</CardTitle>
        <CardDescription>
          Add links that will appear on your landing page (maximum 5).
          Drag and drop to reorder links.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LinksForm 
          links={links}
          onAddLink={onAddLink}
          onDeleteLink={onDeleteLink}
          onReorderLinks={onReorderLinks}
          error={error}
        />
      </CardContent>
    </Card>
  );
};

export default LinksCard;
