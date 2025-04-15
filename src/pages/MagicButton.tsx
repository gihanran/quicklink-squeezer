
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { MagicButton as MagicButtonType } from "@/types/magicButton";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const MagicButton: React.FC = () => {
  const { buttonId } = useParams<{ buttonId: string }>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [magicButton, setMagicButton] = useState<MagicButtonType | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  
  useEffect(() => {
    if (!buttonId) {
      setError('Invalid magic button ID');
      setLoading(false);
      return;
    }

    const fetchMagicButton = async () => {
      try {
        console.log(`Fetching magic button with ID: ${buttonId}`);
        
        // Get the magic button data
        const { data, error } = await supabase
          .from('magic_buttons')
          .select('*')
          .eq('id', buttonId)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching magic button:', error);
          setError('Sorry, this magic button does not exist.');
          setLoading(false);
          return;
        }
        
        if (!data) {
          console.error('Magic button not found');
          setError('Sorry, this magic button does not exist.');
          setLoading(false);
          return;
        }
        
        setMagicButton(data as MagicButtonType);
        
        // Track the click
        try {
          const newClickCount = (data.clicks || 0) + 1;
          const { error: updateError } = await supabase
            .from('magic_buttons')
            .update({ clicks: newClickCount })
            .eq('id', buttonId);
            
          if (updateError) {
            console.error('Error tracking click:', updateError);
          } else {
            console.log(`Successfully updated click count to ${newClickCount}`);
          }
        } catch (trackError) {
          console.error('Failed to track click:', trackError);
        }
        
        setLoading(false);
        
        // Show popup after 3 seconds
        setTimeout(() => {
          setShowPopup(true);
        }, 3000);
        
      } catch (err) {
        console.error('Magic button error:', err);
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    };

    fetchMagicButton();
  }, [buttonId]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Magic Button Not Found</h1>
          <p className="mb-6">{error}</p>
          <Link 
            to="/" 
            className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
          >
            Go back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Embedded content */}
      <div className="flex-grow w-full">
        {magicButton?.original_url && (
          <iframe 
            src={magicButton.original_url} 
            className="w-full h-full min-h-screen" 
            title="Original content"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>
      
      {/* Magic Button Popup */}
      {showPopup && magicButton && (
        <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 shadow-lg border-t flex items-center justify-between p-4 z-50">
          <div className="flex-1 mr-4">
            {magicButton.description || ''}
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href={magicButton.button_url}
              className="bg-[#9b87f5] text-white px-4 py-2 rounded-md text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {magicButton.button_title}
            </a>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClosePopup}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicButton;
