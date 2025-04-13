
import React, { useState } from 'react';
import { useLandingPages } from "@/hooks/useLandingPages";
import LandingPagesList from "@/components/landing-pages/LandingPagesList";
import LandingPageForm from "@/components/landing-pages/LandingPageForm";
import LandingPagePreview from "@/components/landing-pages/LandingPagePreview";
import TrackingDetailsDialog from "@/components/landing-pages/TrackingDetailsDialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { LandingPage } from "@/types/landingPage";

enum ViewState {
  LIST,
  CREATE,
  EDIT,
  PREVIEW
}

const LandingPagesSection: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.LIST);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<LandingPage | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  
  const {
    landingPages,
    loading,
    selectedPage,
    setSelectedPage,
    pageLinks,
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    addPageLink,
    updatePageLink,
    deletePageLink,
    updateLinkOrder,
    fetchPageLinks
  } = useLandingPages();

  const handleCreateNew = () => {
    setSelectedPage(null);
    setViewState(ViewState.CREATE);
  };

  const handleEdit = (page: LandingPage) => {
    setSelectedPage(page);
    setViewState(ViewState.EDIT);
  };

  const handlePreview = (page: LandingPage) => {
    setSelectedPage(page);
    setViewState(ViewState.PREVIEW);
  };

  const handleDelete = (page: LandingPage) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleShowTrackingDetails = async (page: LandingPage) => {
    setSelectedPage(page);
    // Fetch fresh links data for this page
    if (page.id) {
      await fetchPageLinks(page.id);
    }
    setTrackingDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (pageToDelete) {
      await deleteLandingPage(pageToDelete.id);
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  const handleSave = async (pageData: Partial<LandingPage>) => {
    if (viewState === ViewState.CREATE) {
      const newPage = await createLandingPage(pageData);
      if (newPage) {
        setViewState(ViewState.EDIT);
        return newPage;
      }
    } else {
      const updatedPage = await updateLandingPage(pageData.id!, pageData);
      if (updatedPage) {
        return updatedPage;
      }
    }
    return null;
  };

  const handleBack = () => {
    setViewState(ViewState.LIST);
  };

  const renderContent = () => {
    switch (viewState) {
      case ViewState.LIST:
        return (
          <LandingPagesList
            pages={landingPages}
            loading={loading}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onPreview={handlePreview}
            onDelete={handleDelete}
            onShowTrackingDetails={handleShowTrackingDetails}
          />
        );
      case ViewState.CREATE:
        return (
          <LandingPageForm
            page={null}
            links={[]}
            onSave={handleSave}
            onAddLink={addPageLink}
            onUpdateLink={updatePageLink}
            onDeleteLink={deletePageLink}
            onUpdateLinkOrder={updateLinkOrder}
            onBack={handleBack}
          />
        );
      case ViewState.EDIT:
        return (
          <LandingPageForm
            page={selectedPage}
            links={pageLinks}
            onSave={handleSave}
            onAddLink={addPageLink}
            onUpdateLink={updatePageLink}
            onDeleteLink={deletePageLink}
            onUpdateLinkOrder={updateLinkOrder}
            onBack={handleBack}
          />
        );
      case ViewState.PREVIEW:
        return (
          <LandingPagePreview
            page={selectedPage!}
            links={pageLinks}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Landing Pages</h1>
            <p className="text-gray-600">Create and manage simple landing pages with multiple links.</p>
          </div>
        </div>
        
        {renderContent()}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the landing page "{pageToDelete?.title}" and all its links.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TrackingDetailsDialog
        open={trackingDialogOpen}
        onOpenChange={setTrackingDialogOpen}
        page={selectedPage}
        links={pageLinks}
      />
    </>
  );
};

export default LandingPagesSection;
