
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LinkStatsProps {
  stats: {
    totalLinks: number;
    totalClicks: number;
    remainingLinks?: number;
    linkLimit?: number;
  };
  user: any;
}

const LinkStats: React.FC<LinkStatsProps> = ({ stats, user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.totalLinks}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.totalClicks}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Available Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.remainingLinks !== undefined ? stats.remainingLinks : 'N/A'}</p>
          <p className="text-sm text-gray-500">
            of {stats.linkLimit || 100} total limit
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">User ID</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{user?.id ? user.id.slice(0, 8) + '...' : 'Loading...'}</p>
          <p className="text-sm text-gray-500">Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Loading...'}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkStats;
