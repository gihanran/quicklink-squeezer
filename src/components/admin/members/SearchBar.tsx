
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  refreshData: () => void;
  refreshing: boolean;
}

const SearchBar = ({ searchTerm, setSearchTerm, refreshData, refreshing }: SearchBarProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Input
        placeholder="Search by name, email or country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
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

export default SearchBar;
