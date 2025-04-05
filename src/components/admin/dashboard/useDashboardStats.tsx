
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DashboardStats } from "./types";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLinks: 0,
    totalClicks: 0,
    countriesData: [],
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

  const refreshData = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
    toast({
      description: "Dashboard data refreshed"
    });
  };

  return {
    stats,
    loading,
    refreshing,
    fetchStats,
    refreshData
  };
};
