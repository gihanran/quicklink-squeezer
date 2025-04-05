
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsSummaryProps {
  totalLinks: number;
  totalClicks: number;
  averageClicks: number;
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ 
  totalLinks, 
  totalClicks, 
  averageClicks 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalLinks}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalClicks}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Avg. Clicks per Link</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{averageClicks}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSummary;
