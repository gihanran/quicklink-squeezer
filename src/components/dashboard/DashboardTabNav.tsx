
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, ChartBar, UserCircle } from "lucide-react";
import LinkAnalytics from "@/components/LinkAnalytics";
import ProfileSection from "@/components/ProfileSection";

interface DashboardTabNavProps {
  children: React.ReactNode;
  links: any[];
}

const DashboardTabNav: React.FC<DashboardTabNavProps> = ({ children, links }) => {
  return (
    <Tabs defaultValue="links" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
        <TabsTrigger value="links" className="flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          <span className="hidden md:inline">My Links</span>
        </TabsTrigger>
        
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <ChartBar className="h-4 w-4" />
          <span className="hidden md:inline">Analytics</span>
        </TabsTrigger>
        
        <TabsTrigger id="profile-trigger" value="profile" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span className="hidden md:inline">Profile</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="links" className="space-y-6">
        {children}
      </TabsContent>
      
      <TabsContent value="analytics">
        <LinkAnalytics links={links} />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileSection />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabNav;
