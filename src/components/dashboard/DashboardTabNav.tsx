
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, ChartBar, Bell, UserCircle, Layout, Wand2 } from "lucide-react";
import LinkAnalytics from "@/components/LinkAnalytics";
import NotificationsSection from "@/components/NotificationsSection";
import ProfileSection from "@/components/ProfileSection";
import BioCardSection from "@/components/bio-card/BioCardSection";
import MagicButtonsSection from "@/components/magic-button/MagicButtonsSection";

interface DashboardTabNavProps {
  children: React.ReactNode;
  links: any[];
}

const DashboardTabNav: React.FC<DashboardTabNavProps> = ({ children, links }) => {
  return (
    <Tabs defaultValue="links" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-6 mb-8">
        
        <TabsTrigger value="links" className="flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          <span className="hidden md:inline">My Links</span>
        </TabsTrigger>
        <TabsTrigger value="magic-buttons" className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          <span className="hidden md:inline">Magic Button</span>
        </TabsTrigger>
        
        <TabsTrigger value="landing-pages" className="flex items-center gap-2">
          <Layout className="h-4 w-4" />
          <span className="hidden md:inline">Bio Card</span>
        </TabsTrigger>
        
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <ChartBar className="h-4 w-4" />
          <span className="hidden md:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden md:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger id="profile-trigger" value="profile" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span className="hidden md:inline">Profile</span>
        </TabsTrigger>
      </TabsList>

      
      <TabsContent value="links" className="space-y-6">
        {children}
      </TabsContent>

      <TabsContent value="magic-buttons">
        <MagicButtonsSection />
      </TabsContent>

      
      <TabsContent value="landing-pages">
        <BioCardSection />
      </TabsContent>
      
      <TabsContent value="analytics">
        <LinkAnalytics links={links} />
      </TabsContent>

      
      <TabsContent value="notifications">
        <NotificationsSection />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileSection />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabNav;
