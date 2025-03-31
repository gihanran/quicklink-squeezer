
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Clock, Globe, Smartphone } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Dashboard: React.FC = () => {
  // This is a placeholder dashboard - we'll implement the real functionality 
  // after connecting to Supabase for authentication and database
  
  // Sample link data
  const sampleLinks = [
    {
      id: 1,
      originalUrl: "https://www.example.com/very/long/url/that/needs/to/be/shortened/for/better/usability",
      shortCode: "abc123",
      createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      expiresAt: Date.now() + (60 * 24 * 60 * 60 * 1000), // 60 days from now
      visits: 145,
      devices: { desktop: 78, mobile: 52, tablet: 15 },
      browsers: { chrome: 67, firefox: 38, safari: 28, other: 12 },
      locations: { "United States": 64, "United Kingdom": 21, "Germany": 15, "Other": 45 }
    },
    {
      id: 2,
      originalUrl: "https://www.anotherexample.com/blog/post/12345",
      shortCode: "def456",
      createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000), // 15 days ago
      expiresAt: Date.now() + (75 * 24 * 60 * 60 * 1000), // 75 days from now
      visits: 89,
      devices: { desktop: 42, mobile: 38, tablet: 9 },
      browsers: { chrome: 45, firefox: 12, safari: 22, other: 10 },
      locations: { "Canada": 32, "Australia": 18, "France": 24, "Other": 15 }
    }
  ];

  // Calculate days remaining and percentage for expiration
  const calculateExpiration = (createdAt: number, expiresAt: number) => {
    const totalDuration = expiresAt - createdAt;
    const elapsed = Date.now() - createdAt;
    const percentage = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
    const daysLeft = Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000));
    
    return { percentage, daysLeft };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full py-6 px-4 bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/" className="flex items-center">
                <div className="bg-gradient-to-r from-brand-purple to-brand-blue p-2 rounded-md mr-3">
                  <ChartBar className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                  Dashboard
                </h1>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Home
              </a>
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Links Dashboard</h1>
            <p className="text-gray-600">Track and manage your shortened links</p>
          </div>
          <button className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90">
            Create New Link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{sampleLinks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{sampleLinks.reduce((total, link) => total + link.visits, 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Subscription Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium text-green-600">Premium</p>
              <p className="text-sm text-gray-500">Renews on May 15, 2023</p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mb-4">Your Links</h2>
        
        <div className="space-y-6">
          {sampleLinks.map(link => {
            const { percentage, daysLeft } = calculateExpiration(link.createdAt, link.expiresAt);
            
            return (
              <Card key={link.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 truncate max-w-md">
                          {link.originalUrl}
                        </h3>
                        <div className="flex items-center">
                          <span className="text-brand-purple font-medium mr-2">
                            {window.location.origin}/s/{link.shortCode}
                          </span>
                          <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center mt-4 md:mt-0">
                        <span className="text-lg font-medium mr-3">{link.visits} clicks</span>
                        <button className="px-3 py-1.5 text-sm bg-brand-purple text-white rounded-md hover:opacity-90">
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Link expiration</span>
                        <span>{daysLeft} days left</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-brand-purple mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Devices</p>
                          <p className="text-sm">
                            Desktop: {link.devices.desktop}, 
                            Mobile: {link.devices.mobile}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-brand-blue mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Top Locations</p>
                          <p className="text-sm truncate">
                            {Object.entries(link.locations)
                              .slice(0, 2)
                              .map(([country, count]) => `${country}: ${count}`)
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-green-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm">
                            {new Date(link.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      <footer className="w-full py-6 bg-white border-t mt-auto">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} QuickLink Squeezer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
