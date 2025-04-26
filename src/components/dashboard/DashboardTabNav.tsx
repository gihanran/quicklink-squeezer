
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Link as LinkIcon, Unlink } from "lucide-react";
import DashboardContent from "./DashboardContent";
import UnlockerDashboard from "./link-unlocker/UnlockerDashboard";

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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="links" className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4" /> My Links
        </TabsTrigger>
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" /> Dashboard
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
      
      <TabsContent value="unlockers">
        <UnlockerDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabNav;
