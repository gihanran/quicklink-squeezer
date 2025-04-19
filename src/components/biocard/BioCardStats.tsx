
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircleUser, Eye, MousePointer } from 'lucide-react';

interface BioCardStatsProps {
  stats: {
    totalCards: number;
    totalViews: number;
    totalClicks: number;
    remainingCards: number;
    cardLimit: number;
  };
}

const BioCardStats: React.FC<BioCardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <CircleUser className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{stats.totalCards}</h3>
            <p className="text-gray-500 text-sm">Bio Cards</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Eye className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
            <p className="text-gray-500 text-sm">Total Views</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <MousePointer className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{stats.totalClicks}</h3>
            <p className="text-gray-500 text-sm">Total Clicks</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BioCardStats;
