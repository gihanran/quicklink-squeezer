
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { LandingPage, LandingPageLink } from "@/types/landingPage";
import PageAnalytics from "./form/PageAnalytics";

interface TrackingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: LandingPage | null;
  links: LandingPageLink[];
}

const TrackingDetailsDialog: React.FC<TrackingDetailsDialogProps> = ({
  open,
  onOpenChange,
  page,
  links
}) => {
  if (!page) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Tracking Details - {page.title}</DialogTitle>
          <DialogDescription>
            View analytics for your bio card and its links
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <PageAnalytics page={page} links={links} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingDetailsDialog;
