
import React from 'react';
import LinksHeader from "./LinksHeader";
import CreateLinkCard from "./CreateLinkCard";
import LinkStats from "./LinkStats";
import LinksList from "./LinksList";
import { UrlData } from "@/utils/url/types";
import { calculateExpiration } from "./utils/expirationUtils";

interface DashboardContentProps {
  links: UrlData[];
  loading: boolean;
  stats: {
    totalLinks: number;
    totalClicks: number;
    remainingLinks?: number;
    linkLimit?: number;
  };
  user: any;
  showCreateForm: boolean;
  handleCreateNewLink: () => void;
  handleLinkCreated: () => void;
  handleUrlShortened: () => void;
  handleDeleteLink: (link: UrlData) => void;
  handleEditTitle: (link: UrlData) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  links,
  loading,
  stats,
  user,
  showCreateForm,
  handleCreateNewLink,
  handleLinkCreated,
  handleUrlShortened,
  handleDeleteLink,
  handleEditTitle
}) => {
  return (
    <>
      <LinksHeader handleCreateNewLink={handleCreateNewLink} />

      {showCreateForm && (
        <CreateLinkCard 
          handleLinkCreated={handleLinkCreated} 
          handleUrlShortened={handleUrlShortened} 
        />
      )}

      <LinkStats stats={stats} user={user} />

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

export default DashboardContent;
