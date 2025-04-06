
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AdPopupProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  adUrl: string;
}

const AdPopup: React.FC<AdPopupProps> = ({ open, onClose, onComplete, adUrl }) => {
  const [countdown, setCountdown] = useState(15);
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    let timer: number;
    
    if (open && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setShowCloseButton(true);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [open, countdown]);

  useEffect(() => {
    if (!open) {
      // Reset state when popup is closed
      setCountdown(15);
      setShowCloseButton(false);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && showCloseButton) handleClose();
    }}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 border-none">
        <div className="w-full h-[90px] flex justify-center items-center">
          <iframe
            src={adUrl}
            width="728"
            height="90"
            frameBorder="0"
            scrolling="no"
            className="mx-auto"
          />
        </div>
        <div className="p-4 flex items-center justify-between border-t">
          <p className="text-sm text-gray-500">
            {countdown > 0 ? `Please wait ${countdown} seconds...` : "You can close the ad now"}
          </p>
          {showCloseButton && (
            <Button 
              onClick={handleClose} 
              className="bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity"
              size="sm"
            >
              <X className="mr-2 h-4 w-4" /> Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdPopup;
