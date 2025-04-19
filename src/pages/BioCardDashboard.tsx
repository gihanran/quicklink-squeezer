
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import BioCardContainer from '@/components/biocard/BioCardContainer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuthState } from '@/hooks/auth';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const BioCardDashboard: React.FC = () => {
  const { user, signOut } = useAuthState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader handleLogout={handleLogout} user={user} />

      <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="biocards" className="w-full">
          <TabsContent value="biocards" className="space-y-6">
            <BioCardContainer />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default BioCardDashboard;
