
import React from 'react';
import { useAuthState } from "@/hooks/auth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Footer from "@/components/Footer";
import DashboardTabNav from "@/components/dashboard/DashboardTabNav";
import LinkDialogs from "@/components/dashboard/LinkDialogs";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "./hooks/useDashboardData";
import { useLinkActions } from "./hooks/useLinkActions";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar/sidebar-context";

export interface DashboardContainerProps {
  // Add any props if needed in the future
}

const DashboardContainer: React.FC<DashboardContainerProps> = () => {
  const {
    links,
    setLinks,
    loading,
    stats,
    showCreateForm,
    user,
    handleCreateNewLink,
    handleLinkCreated,
    updateStats,
  } = useDashboardData();

  const {
    selectedLink,
    deleteDialogOpen,
    setDeleteDialogOpen,
    titleDialogOpen,
    setTitleDialogOpen,
    newTitle,
    setNewTitle,
    handleDeleteLink,
    handleEditTitle,
    confirmDeleteLink,
    confirmUpdateTitle
  } = useLinkActions();
  
  const { signOut } = useAuthState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleUrlShortened = () => {
    updateStats();
  };

  const handleConfirmDeleteLink = async () => {
    await confirmDeleteLink(links, setLinks, updateStats);
  };

  const handleConfirmUpdateTitle = async () => {
    await confirmUpdateTitle(links, setLinks);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader handleLogout={handleLogout} user={user} />

        <div className="flex flex-1">
          <AppSidebar />
          
          <main className="flex-grow container max-w-6xl mx-auto px-4 py-8">
            <DashboardTabNav links={links}>
              <DashboardContent 
                links={links}
                loading={loading}
                stats={stats}
                user={user}
                showCreateForm={showCreateForm}
                handleCreateNewLink={handleCreateNewLink}
                handleLinkCreated={handleLinkCreated}
                handleUrlShortened={handleUrlShortened}
                handleDeleteLink={handleDeleteLink}
                handleEditTitle={handleEditTitle}
              />
            </DashboardTabNav>
          </main>
        </div>

        <Footer />
        
        {/* Link dialogs */}
        <LinkDialogs 
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          selectedLink={selectedLink}
          confirmDeleteLink={handleConfirmDeleteLink}
          titleDialogOpen={titleDialogOpen}
          setTitleDialogOpen={setTitleDialogOpen}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          confirmUpdateTitle={handleConfirmUpdateTitle}
        />
      </div>
    </SidebarProvider>
  );
};

export default DashboardContainer;
