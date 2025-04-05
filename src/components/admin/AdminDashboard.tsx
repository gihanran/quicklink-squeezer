
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Link2, MousePointer, Globe, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as RechartsPrimitive from "recharts";
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLinks: 0,
    totalClicks: 0,
    countriesData: [] as { country: string; count: number }[],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching admin dashboard stats...");
      
      // Fetch total users
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (userError) {
        console.error("Error fetching user count:", userError);
        throw userError;
      }
      
      console.log("Total users:", userCount);

      // Fetch total links
      const { count: linkCount, error: linkError } = await supabase
        .from('short_urls')
        .select('*', { count: 'exact', head: true });

      if (linkError) {
        console.error("Error fetching link count:", linkError);
        throw linkError;
      }
      
      console.log("Total links:", linkCount);

      // Fetch total clicks using the function
      const { data: clickData, error: clickError } = await supabase
        .rpc('get_total_clicks');

      if (clickError) {
        console.error("Error fetching total clicks:", clickError);
        throw clickError;
      }
      
      const totalClicks = clickData[0]?.total_clicks || 0;
      console.log("Total clicks:", totalClicks);

      // Fetch countries data
      const { data: countryData, error: countryError } = await supabase
        .from('profiles')
        .select('country')
        .not('country', 'is', null);

      if (countryError) {
        console.error("Error fetching country data:", countryError);
        throw countryError;
      }

      // Process country data
      const countryCounts = countryData.reduce((acc, profile) => {
        if (!profile.country) return acc;
        acc[profile.country] = (acc[profile.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const countriesData = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 countries
      
      console.log("Countries data:", countriesData);

      setStats({
        totalUsers: userCount || 0,
        totalLinks: linkCount || 0,
        totalClicks,
        countriesData,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Error loading statistics",
        description: "Could not load admin dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
    toast({
      description: "Dashboard data refreshed"
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Button 
          variant="outline" 
          onClick={refreshData} 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-brand-purple" />
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
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
            <p className="text-4xl font-bold">{stats.totalLinks}</p>
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
            <p className="text-4xl font-bold">{stats.totalClicks}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5" />
              Members by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.countriesData.length > 0 ? (
              <div className="h-[300px]">
                <RechartsPrimitive.ResponsiveContainer width="100%" height={300}>
                  <RechartsPrimitive.BarChart data={stats.countriesData}>
                    <RechartsPrimitive.XAxis dataKey="country" />
                    <RechartsPrimitive.YAxis />
                    <RechartsPrimitive.Tooltip />
                    <RechartsPrimitive.Bar dataKey="count" fill="#8884d8" />
                  </RechartsPrimitive.BarChart>
                </RechartsPrimitive.ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-gray-500 my-12">No country data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              More detailed analytics coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
