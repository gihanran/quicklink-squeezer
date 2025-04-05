
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimelineChart from './charts/TimelineChart';
import LocationsChart from './charts/LocationsChart';
import PieChartComponent from './charts/PieChartComponent';
import DeviceBreakdown from './DeviceBreakdown';
import { DEVICE_COLORS, BROWSER_COLORS, generateChartConfig } from './utils/chartUtils';

interface AnalyticsTabContentProps {
  deviceData: { name: string; value: number }[];
  browserData: { name: string; value: number }[];
  locationData: { name: string; value: number }[];
  timelineData: { date: string; clicks: number }[];
  devices: {[key: string]: number};
}

const AnalyticsTabContent: React.FC<AnalyticsTabContentProps> = ({
  deviceData,
  browserData,
  locationData,
  timelineData,
  devices,
}) => {
  const chartConfig = generateChartConfig();

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="devices">Devices</TabsTrigger>
        <TabsTrigger value="geography">Geography</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimelineChart data={timelineData} />
          <LocationsChart data={locationData} />
        </div>
      </TabsContent>
      
      <TabsContent value="devices">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PieChartComponent 
            data={deviceData}
            title="Device Distribution"
            description="Breakdown of visitors by device type"
            colorMap={DEVICE_COLORS}
            config={chartConfig.devices}
          />
          
          <PieChartComponent 
            data={browserData}
            title="Browser Distribution"
            description="Breakdown of visitors by browser"
            colorMap={BROWSER_COLORS}
            config={chartConfig.browsers}
          />
          
          <DeviceBreakdown devices={devices} />
        </div>
      </TabsContent>
      
      <TabsContent value="geography">
        <LocationsChart data={locationData} horizontal={true} />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabContent;
