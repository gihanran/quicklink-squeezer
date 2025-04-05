
import React from 'react';
import LinksHeader from "../LinksHeader";

interface DashboardHeaderProps {
  handleCreateNewLink: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ handleCreateNewLink }) => {
  return <LinksHeader handleCreateNewLink={handleCreateNewLink} />;
};

export default DashboardHeader;
