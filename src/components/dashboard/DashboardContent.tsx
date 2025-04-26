import React from 'react';
import { UrlData } from "@/utils/url/types";
import { calculateExpiration } from "./utils/expirationUtils";
import DashboardHeader from "./content/DashboardHeader";
import CreateLinkSection from "./content/CreateLinkSection";
import StatsSection from "./content/StatsSection";
import LinksListSection from "./content/LinksListSection";
import UnlockerDashboard from "./link-unlocker/UnlockerDashboard";

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
      <DashboardHeader handleCreateNewLink={handleCreateNewLink} />

      <CreateLinkSection
        showCreateForm={showCreateForm}
        handleLinkCreated={handleLinkCreated}
        handleUrlShortened={handleUrlShortened}
      />

      <StatsSection stats={stats} user={user} />

      <div className="mt-12">
        <UnlockerDashboard />
      </div>

      <LinksListSection 
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
