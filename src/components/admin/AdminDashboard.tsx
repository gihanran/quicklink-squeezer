
import React, { useEffect } from 'react';
import { useDashboardStats } from './dashboard/useDashboardStats';
import DashboardHeader from './dashboard/DashboardHeader';
import StatCards from './dashboard/StatCards';
import CountryChart from './dashboard/CountryChart';
import GrowthCard from './dashboard/GrowthCard';

const AdminDashboard = () => {
  const { stats, loading, refreshing, fetchStats, refreshData } = useDashboardStats();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader refreshData={refreshData} refreshing={refreshing} />

      <StatCards 
        totalUsers={stats.totalUsers}
        totalLinks={stats.totalLinks}
        totalClicks={stats.totalClicks}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountryChart countriesData={stats.countriesData} />
        <GrowthCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
