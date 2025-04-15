
import React from 'react';
import { useBioCardSection, BioCardViewState } from "@/hooks/useBioCardSection";
import BioCardList from "@/components/bio-card/BioCardList";
import BioCardForm from "@/components/bio-card/BioCardForm";
import BioCardPreview from "@/components/bio-card/BioCardPreview";
import TrackingDetailsDialog from "@/components/bio-card/TrackingDetailsDialog";
import DeleteConfirmationDialog from "@/components/bio-card/dialogs/DeleteConfirmationDialog";
import BioCardHeader from "@/components/bio-card/BioCardHeader";

const BioCardSection: React.FC = () => {
  const {
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
  } = useBioCardSection();

  const renderContent = () => {
    switch (viewState) {
      case BioCardViewState.LIST:
        return (
          <BioCardList
            pages={landingPages}
            loading={loading}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onPreview={handlePreview}
            onDelete={handleDelete}
            onShowTrackingDetails={handleShowTrackingDetails}
          />
        );
      case BioCardViewState.CREATE:
        return (
          <BioCardForm
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
      case BioCardViewState.EDIT:
        return (
          <BioCardForm
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
      case BioCardViewState.PREVIEW:
        return (
          <BioCardPreview
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
        <BioCardHeader />
        {renderContent()}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        pageToDelete={pageToDelete}
        onConfirm={confirmDelete}
      />

      <TrackingDetailsDialog
        open={trackingDialogOpen}
        onOpenChange={setTrackingDialogOpen}
        page={selectedPage}
        links={pageLinks}
      />
    </>
  );
};

export default BioCardSection;
