
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Link as LinkIcon, Unlink, LayoutGrid } from "lucide-react";
import DashboardContent from "./DashboardContent";
import UnlockerDashboard from "./link-unlocker/UnlockerDashboard";
import { Link } from "react-router-dom";

interface DashboardTabNavProps {
  links: any[];
  children: React.ReactNode;
}

const DashboardTabNav: React.FC<DashboardTabNavProps> = ({ links, children }) => {
  const [activeTab, setActiveTab] = useState("links");

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="w-full space-y-4"
    >
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="links" className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4" /> My Links
        </TabsTrigger>
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </TabsTrigger>
        <TabsTrigger value="biocards" className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" /> Bio Cards
        </TabsTrigger>
        <TabsTrigger value="unlockers" className="flex items-center gap-2">
          <Unlink className="h-4 w-4" /> Link Unlockers
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="links">
        {React.Children.toArray(children).find((child: any) => 
          child.type === DashboardContent
        )}
      </TabsContent>
      
      <TabsContent value="dashboard">
        {/* Placeholder for future dashboard content */}
        <div className="p-4 text-center text-muted-foreground">
          Dashboard insights coming soon
        </div>
      </TabsContent>
      
      <TabsContent value="biocards">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Bio Cards</h2>
          <p className="text-gray-600 mb-4">
            Create and manage your bio cards to showcase all your important links in one place
          </p>
          <Link 
            to="/biocard" 
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-brand-purple text-white font-medium hover:bg-brand-purple/90 transition-colors"
          >
            Go to Bio Cards Dashboard
          </Link>
        </div>
      </TabsContent>
      
      <TabsContent value="unlockers">
        <UnlockerDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabNav;
