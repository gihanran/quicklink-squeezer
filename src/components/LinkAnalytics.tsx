
import React, { useEffect, useState } from 'react';
import { getUrlWithAnalytics } from "@/utils/url";
import AnalyticsSummary from './dashboard/analytics/AnalyticsSummary';
import AnalyticsTabContent from './dashboard/analytics/AnalyticsTabContent';
import { aggregateAnalyticsData, formatChartData } from './dashboard/analytics/utils/dataProcessing';

interface LinkAnalyticsProps {
  links: any[];
}

const LinkAnalytics: React.FC<LinkAnalyticsProps> = ({ links }) => {
  const [enhancedLinks, setEnhancedLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enhanceLinksWithAnalytics = async () => {
      if (!links || links.length === 0) {
        setEnhancedLinks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const enhanced = await Promise.all(
          links.map(async (link) => {
            try {
              const enhancedLink = await getUrlWithAnalytics(link.shortCode);
              return enhancedLink || link;
            } catch (error) {
              console.error(`Error enhancing link ${link.shortCode}:`, error);
              return link;
            }
          })
        );
        setEnhancedLinks(enhanced);
      } catch (error) {
        console.error('Error enhancing links with analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    enhanceLinksWithAnalytics();
  }, [links]);

  // Process the data
  const aggregatedData = aggregateAnalyticsData(enhancedLinks);
  const { deviceData, browserData, locationData, timelineData } = formatChartData(aggregatedData);
  
  // Calculate summary statistics
  const totalLinks = enhancedLinks.length;
  const totalClicks = enhancedLinks.reduce((total, link) => total + (link.visits || 0), 0);
  const averageClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  // Ensure devices object has all required properties
  const devices = {
    desktop: aggregatedData.devices.desktop || 0,
    mobile: aggregatedData.devices.mobile || 0,
    tablet: aggregatedData.devices.tablet || 0,
    ...aggregatedData.devices  // Include any additional device types
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Visualize your link performance</p>
        </div>
      </div>
      
      <AnalyticsSummary 
        totalLinks={totalLinks}
        totalClicks={totalClicks}
        averageClicks={averageClicks}
      />
      
      <AnalyticsTabContent 
        deviceData={deviceData}
        browserData={browserData}
        locationData={locationData}
        timelineData={timelineData}
        devices={devices}
      />
    </div>
  );
};

export default LinkAnalytics;
