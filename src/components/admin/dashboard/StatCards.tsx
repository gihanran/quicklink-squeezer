
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Link2, MousePointer } from "lucide-react";

interface StatCardsProps {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
}

const StatCards = ({ totalUsers, totalLinks, totalClicks }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Users className="mr-2 h-5 w-5 text-brand-purple" />
            Total Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalUsers}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Link2 className="mr-2 h-5 w-5 text-brand-blue" />
            Total Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalLinks}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <MousePointer className="mr-2 h-5 w-5 text-green-600" />
            Total Clicks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalClicks}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
