
import React, { useState, useEffect } from 'react';
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

const AdPopup: React.FC<AdPopupProps> = ({ open, onClose, onComplete, adUrl, adScript = false }) => {
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

  useEffect(() => {
    // Add script to DOM when popup is opened
    if (open && adScript) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//pl26346008.profitableratecpm.com/37/89/81/378981276f8c95e8b6edb72975f7c5be.js';
      script.async = true;
      script.id = 'ad-script';
      
      // Add script to the ad container
      const adContainer = document.getElementById('ad-script-container');
      if (adContainer) {
        adContainer.appendChild(script);
      }
      
      return () => {
        // Remove script when component unmounts or popup closes
        if (document.getElementById('ad-script')) {
          const scriptElement = document.getElementById('ad-script');
          if (scriptElement && scriptElement.parentNode) {
            scriptElement.parentNode.removeChild(scriptElement);
          }
        }
      };
    }
  }, [open, adScript]);

  const handleClose = () => {
    onClose();
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && showCloseButton) handleClose();
    }}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 border-none">
        {adScript ? (
          <div id="ad-script-container" className="w-full h-[250px] flex justify-center items-center">
            {/* Ad script will be injected here */}
          </div>
        ) : adUrl ? (
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
        ) : (
          <div className="w-full h-[250px] flex justify-center items-center">
            Loading advertisement...
          </div>
        )}
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
