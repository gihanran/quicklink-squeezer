
import React from 'react';
import LinkStats from "../LinkStats";

interface StatsSectionProps {
  stats: {
    totalLinks: number;
    totalClicks: number;
    remainingLinks?: number;
    linkLimit?: number;
  };
  user: any;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats, user }) => {
  return <LinkStats stats={stats} user={user} />;
};

export default StatsSection;
