
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            Your Total Links
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-48">Total number of links you've created</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.totalLinks}</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            Your Total Clicks
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-48">Total clicks across all your links</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.totalClicks}</p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            Available Links
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-48">Number of links you can still create</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{stats.remainingLinks !== undefined ? stats.remainingLinks : 'N/A'}</p>
          <p className="text-sm text-gray-500">
            of {stats.linkLimit || 1000} total limit
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            User ID
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-48">Your unique identifier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
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
