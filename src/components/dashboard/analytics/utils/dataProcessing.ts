
// Aggregate data from links for charts
export const aggregateAnalyticsData = (enhancedLinks: any[]) => {
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
  
  // Distribute total clicks across the last 7 days
  const totalClicks = enhancedLinks.reduce((sum, link) => sum + (link.visits || 0), 0);
  
  // Distribute clicks with more recent days having more clicks (weighted distribution)
  let remainingClicks = totalClicks;
  const weights = [0.25, 0.2, 0.15, 0.15, 0.1, 0.1, 0.05]; // Weights for days, most recent first
  
  last7Days.forEach((day, index) => {
    const dayClicks = Math.round(totalClicks * weights[index]);
    clicksOverTime[day] = dayClicks;
    remainingClicks -= dayClicks;
  });
  
  // Add any remaining clicks to the most recent day
  if (remainingClicks > 0) {
    clicksOverTime[last7Days[last7Days.length - 1]] += remainingClicks;
  }

  enhancedLinks.forEach(link => {
    // Aggregate device data
    if (link.devices) {
      Object.entries(link.devices).forEach(([device, count]) => {
        devices[device] = (devices[device] || 0) + (count as number);
      });
    }
    
    // Aggregate browser data
    if (link.browsers) {
      Object.entries(link.browsers).forEach(([browser, count]) => {
        browsers[browser] = (browsers[browser] || 0) + (count as number);
      });
    }
    
    // Aggregate location data
    if (link.locations) {
      Object.entries(link.locations).forEach(([location, count]) => {
        locations[location] = (locations[location] || 0) + (count as number);
      });
    }
  });
  
  return { devices, browsers, locations, clicksOverTime };
};

// Format data for different chart types
export const formatChartData = (data: { 
  devices: {[key: string]: number},
  browsers: {[key: string]: number},
  locations: {[key: string]: number},
  clicksOverTime: {[key: string]: number}
}) => {
  const deviceData = Object.entries(data.devices).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(data.browsers).map(([name, value]) => ({ name, value }));
  const locationData = Object.entries(data.locations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
  
  const timelineData = Object.entries(data.clicksOverTime).map(([date, clicks]) => ({
    date,
    clicks
  }));

  return { deviceData, browserData, locationData, timelineData };
};
