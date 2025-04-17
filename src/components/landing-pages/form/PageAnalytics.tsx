
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PageAnalyticsProps {
  page: LandingPage;
  links: LandingPageLink[];
}

const PageAnalytics: React.FC<PageAnalyticsProps> = ({ page, links }) => {
  // Prepare data for the chart
  const chartData = links.map(link => ({
    name: link.title,
    clicks: link.clicks || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-3xl font-bold">{page.views || 0}</p>
            </div>
            <div className="bg-slate-100 p-4 rounded-md text-center">
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-3xl font-bold">
                {links.reduce((sum, link) => sum + (link.clicks || 0), 0)}
              </p>
            </div>
          </div>
          
          {links.length > 0 && (
            <div className="h-64">
              <p className="text-sm font-medium mb-2">Clicks by Link</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} height={60} tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PageAnalytics;
