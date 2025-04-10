
import React from 'react';
import LinksList from "../LinksList";
import { UrlData } from "@/utils/url/types";

interface LinksListSectionProps {
  links: UrlData[];
  loading: boolean;
  calculateExpiration: (createdAt: number, expiresAt?: number) => { percentage: number, daysLeft: number };
  handleCreateNewLink: () => void;
  handleDeleteLink: (link: UrlData) => void;
  handleEditTitle: (link: UrlData) => void;
}

const LinksListSection: React.FC<LinksListSectionProps> = ({
  links,
  loading,
  calculateExpiration,
  handleCreateNewLink,
  handleDeleteLink,
  handleEditTitle
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Your Links</h2>
      
      <LinksList 
        links={links} 
        loading={loading}
        calculateExpiration={calculateExpiration}
        handleCreateNewLink={handleCreateNewLink}
        handleDeleteLink={handleDeleteLink}
        handleEditTitle={handleEditTitle}
      />
    </>
  );
};

export default LinksListSection;
