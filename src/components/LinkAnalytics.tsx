
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Smartphone, Laptop, Tablet } from "lucide-react";

const COLORS = ['#8B5CF6', '#EC4899', '#F97316', '#22C55E', '#0EA5E9', '#6366F1', '#A855F7'];
const DEVICE_COLORS = {
  desktop: '#8B5CF6',
  mobile: '#EC4899',
  tablet: '#F97316'
};

const BROWSER_COLORS = {
  chrome: '#22C55E',
  firefox: '#0EA5E9',
  safari: '#6366F1',
  other: '#A855F7'
};

interface LinkAnalyticsProps {
  links: any[];
}

const LinkAnalytics: React.FC<LinkAnalyticsProps> = ({ links }) => {
  // Aggregate data from all links
  const aggregateData = () => {
    const devices: {[key: string]: number} = { desktop: 0, mobile: 0, tablet: 0 };
    const browsers: {[key: string]: number} = { chrome: 0, firefox: 0, safari: 0, other: 0 };
    const locations: {[key: string]: number} = {};
    const clicksOverTime: {[key: string]: number} = {};
    
    // Sample data for timeline
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Initialize clicks over time
    last7Days.forEach(day => {
      clicksOverTime[day] = 0;
    });
    
    // Add 30 clicks randomly distributed over the last 7 days
    for (let i = 0; i < 30; i++) {
      const randomDay = last7Days[Math.floor(Math.random() * last7Days.length)];
      clicksOverTime[randomDay] = (clicksOverTime[randomDay] || 0) + 1;
    }

    links.forEach(link => {
      // Aggregate device data
      if (link.devices) {
        Object.entries(link.devices).forEach(([device, count]) => {
          devices[device] = (devices[device] || 0) + (count as number);
        });
      } else {
        // Add sample data if none exists
        devices.desktop += Math.floor(Math.random() * 20) + 5;
        devices.mobile += Math.floor(Math.random() * 15) + 3;
        devices.tablet += Math.floor(Math.random() * 5) + 1;
      }
      
      // Aggregate browser data
      if (link.browsers) {
        Object.entries(link.browsers).forEach(([browser, count]) => {
          browsers[browser] = (browsers[browser] || 0) + (count as number);
        });
      } else {
        // Add sample data if none exists
        browsers.chrome += Math.floor(Math.random() * 15) + 10;
        browsers.firefox += Math.floor(Math.random() * 8) + 5;
        browsers.safari += Math.floor(Math.random() * 10) + 7;
        browsers.other += Math.floor(Math.random() * 4) + 1;
      }
      
      // Aggregate location data
      if (link.locations) {
        Object.entries(link.locations).forEach(([location, count]) => {
          locations[location] = (locations[location] || 0) + (count as number);
        });
      } else {
        // Add sample data
        const sampleLocations = ["United States", "United Kingdom", "Germany", "Canada", "Australia", "France", "India", "Japan"];
        sampleLocations.forEach(loc => {
          locations[loc] = (locations[loc] || 0) + Math.floor(Math.random() * 5) + 1;
        });
      }
    });
    
    return { devices, browsers, locations, clicksOverTime };
  };
  
  const { devices, browsers, locations, clicksOverTime } = aggregateData();
  
  // Format data for charts
  const deviceData = Object.entries(devices).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(browsers).map(([name, value]) => ({ name, value }));
  const locationData = Object.entries(locations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
  
  const timelineData = Object.entries(clicksOverTime).map(([date, clicks]) => ({
    date,
    clicks
  }));

  const chartConfig = {
    devices: {
      desktop: { label: "Desktop", theme: { light: DEVICE_COLORS.desktop, dark: DEVICE_COLORS.desktop } },
      mobile: { label: "Mobile", theme: { light: DEVICE_COLORS.mobile, dark: DEVICE_COLORS.mobile } },
      tablet: { label: "Tablet", theme: { light: DEVICE_COLORS.tablet, dark: DEVICE_COLORS.tablet } },
    },
    browsers: {
      chrome: { label: "Chrome", theme: { light: BROWSER_COLORS.chrome, dark: BROWSER_COLORS.chrome } },
      firefox: { label: "Firefox", theme: { light: BROWSER_COLORS.firefox, dark: BROWSER_COLORS.firefox } },
      safari: { label: "Safari", theme: { light: BROWSER_COLORS.safari, dark: BROWSER_COLORS.safari } },
      other: { label: "Other", theme: { light: BROWSER_COLORS.other, dark: BROWSER_COLORS.other } },
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Visualize your link performance</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{links.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{links.reduce((total, link) => total + (link.visits || 0), 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Avg. Clicks per Link</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {links.length > 0 ? Math.round(links.reduce((total, link) => total + (link.visits || 0), 0) / links.length) : 0}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
                <CardDescription>Daily click trends for the past 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timelineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 45 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#8B5CF6" 
                      strokeWidth={2} 
                      dot={{ stroke: '#8B5CF6', strokeWidth: 2, r: 4, fill: 'white' }}
                      activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#8B5CF6' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Geographic distribution of clicks</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Clicks" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="devices">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Breakdown of visitors by device type</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer config={chartConfig.devices}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(DEVICE_COLORS)[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Browser Distribution</CardTitle>
                <CardDescription>Breakdown of visitors by browser</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ChartContainer config={chartConfig.browsers}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={browserData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {browserData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(BROWSER_COLORS)[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Detailed statistics by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-purple-50">
                    <Laptop className="h-10 w-10 text-brand-purple mb-2" />
                    <h3 className="text-xl font-bold text-brand-purple">Desktop</h3>
                    <p className="text-2xl font-bold mt-2">{devices.desktop || 0}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(((devices.desktop || 0) / (Object.values(devices).reduce((a, b) => a + b, 0))) * 100)}% of total
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-pink-50">
                    <Smartphone className="h-10 w-10 text-pink-500 mb-2" />
                    <h3 className="text-xl font-bold text-pink-500">Mobile</h3>
                    <p className="text-2xl font-bold mt-2">{devices.mobile || 0}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(((devices.mobile || 0) / (Object.values(devices).reduce((a, b) => a + b, 0))) * 100)}% of total
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-orange-50">
                    <Tablet className="h-10 w-10 text-orange-500 mb-2" />
                    <h3 className="text-xl font-bold text-orange-500">Tablet</h3>
                    <p className="text-2xl font-bold mt-2">{devices.tablet || 0}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(((devices.tablet || 0) / (Object.values(devices).reduce((a, b) => a + b, 0))) * 100)}% of total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Click distribution by country</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationData}
                  margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Clicks" fill="#8B5CF6">
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkAnalytics;
