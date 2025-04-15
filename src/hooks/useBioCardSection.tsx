
import { useState } from 'react';
import { useLandingPages } from "@/hooks/useLandingPages";
import { LandingPage } from "@/types/landingPage";

export enum BioCardViewState {
  LIST,
  CREATE,
  EDIT,
  PREVIEW
}

export const useBioCardSection = () => {
  const [viewState, setViewState] = useState<BioCardViewState>(BioCardViewState.LIST);
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
    setViewState(BioCardViewState.CREATE);
  };

  const handleEdit = (page: LandingPage) => {
    setSelectedPage(page);
    setViewState(BioCardViewState.EDIT);
  };

  const handlePreview = (page: LandingPage) => {
    setSelectedPage(page);
    setViewState(BioCardViewState.PREVIEW);
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
    if (viewState === BioCardViewState.CREATE) {
      const newPage = await createLandingPage(pageData);
      if (newPage) {
        setViewState(BioCardViewState.EDIT);
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
    setViewState(BioCardViewState.LIST);
  };

  return {
    viewState,
    deleteDialogOpen,
    setDeleteDialogOpen,
    pageToDelete,
    trackingDialogOpen,
    setTrackingDialogOpen,
    landingPages,
    loading,
    selectedPage,
    pageLinks,
    handleCreateNew,
    handleEdit,
    handlePreview,
    handleDelete,
    handleShowTrackingDetails,
    confirmDelete,
    handleSave,
    handleBack,
    addPageLink,
    updatePageLink,
    deletePageLink,
    updateLinkOrder
  };
};
