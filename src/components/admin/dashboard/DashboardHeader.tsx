
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  refreshData: () => void;
  refreshing: boolean;
}

const DashboardHeader = ({ refreshData, refreshing }: DashboardHeaderProps) => {
  return (
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
  );
};

export default DashboardHeader;
