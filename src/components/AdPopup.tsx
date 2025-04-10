
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
    // Add ad content to DOM when popup is opened
    if (open) {
      const adContainer = document.getElementById('ad-script-container');
      if (adContainer) {
        // Clear previous content
        adContainer.innerHTML = '';
        
        // Add atOptions script
        const optionsScript = document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.text = `
          atOptions = {
            'key' : 'dc40773a43925f7ad0dfc2daddd743d9',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `;
        adContainer.appendChild(optionsScript);
        
        // Add invoke script
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = '//www.highperformanceformat.com/dc40773a43925f7ad0dfc2daddd743d9/invoke.js';
        invokeScript.async = true;
        adContainer.appendChild(invokeScript);
      }
    }
    
    return () => {
      // Cleanup function - clear the ad container when component unmounts
      const adContainer = document.getElementById('ad-script-container');
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
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
        <div id="ad-script-container" className="w-full min-h-[250px] flex justify-center items-center p-4">
          {/* Ad scripts will be injected here */}
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
