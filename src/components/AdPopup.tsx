
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AdPopupProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  adUrl?: string;
  adScript?: boolean;
}

const AdPopup: React.FC<AdPopupProps> = ({ open, onClose, onComplete }) => {
  const handleClose = () => {
    onClose();
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 border-none">
        <div id="ad-script-container" className="w-full min-h-[250px] flex justify-center items-center p-4">
          {/* Ad scripts will be injected here */}
        </div>
        <div className="p-4 flex items-center justify-between border-t">
          <p className="text-sm text-gray-500">
            Thank you for using our service
          </p>
          <Button 
            onClick={handleClose} 
            className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity"
            size="sm"
          >
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdPopup;
