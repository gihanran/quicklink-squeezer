
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, ChartBar, UserCircle } from "lucide-react";
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
        
        <TabsTrigger value="biocards" className="flex items-center gap-2">
          <ChartBar className="h-4 w-4" />
          <span className="hidden md:inline">Bio Cards</span>
        </TabsTrigger>
        
        <TabsTrigger id="profile-trigger" value="profile" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          <span className="hidden md:inline">Profile</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="links" className="space-y-6">
        {children}
      </TabsContent>

      <TabsContent value="biocards">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-4">Bio Cards</h2>
          <p className="text-gray-600 mb-4">
            Create and manage your bio cards to showcase all your important links in one place
          </p>
          <a 
            href="/biocard" 
            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-brand-purple text-white font-medium hover:bg-brand-purple/90 transition-colors"
          >
            Go to Bio Cards Dashboard
          </a>
        </div>
      </TabsContent>

      <TabsContent value="profile">
        <ProfileSection />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabNav;
