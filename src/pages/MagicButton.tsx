
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { MagicButton as MagicButtonType } from "@/types/magicButton";
import { toast } from "@/hooks/use-toast";

const MagicButton: React.FC = () => {
  const { buttonId } = useParams<{ buttonId: string }>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (!buttonId) {
      setError('Invalid magic button ID');
      setLoading(false);
      return;
    }

    const handleRedirect = async () => {
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
        
        const magicButton = data as MagicButtonType;
        console.log('Found magic button data:', magicButton);
        
        // Track the click inline - no separate page/redirect needed
        const newClickCount = (magicButton.clicks || 0) + 1;
        const { error: updateError } = await supabase
          .from('magic_buttons')
          .update({ clicks: newClickCount })
          .eq('id', buttonId);
          
        if (updateError) {
          console.error('Error tracking click:', updateError);
          // Continue with redirect even if tracking fails
        } else {
          console.log(`Successfully updated click count to ${newClickCount}`);
        }
        
        // Create the magic button script to inject into the page
        const script = document.createElement('script');
        script.innerHTML = `
          // Wait 3 seconds before showing the popup
          setTimeout(() => {
            // Create the popup element
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.bottom = '0';
            popup.style.left = '0';
            popup.style.right = '0';
            popup.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            popup.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
            popup.style.padding = '12px 16px';
            popup.style.zIndex = '999999';
            popup.style.display = 'flex';
            popup.style.alignItems = 'center';
            popup.style.justifyContent = 'space-between';
            popup.style.fontFamily = 'system-ui, -apple-system, sans-serif';
            
            // Add the description
            const description = document.createElement('div');
            description.textContent = '${magicButton.description || ''}';
            description.style.flex = '1';
            description.style.fontSize = '14px';
            
            // Add the button
            const button = document.createElement('a');
            button.href = '${magicButton.button_url}';
            button.textContent = '${magicButton.button_title}';
            button.style.backgroundColor = '#9b87f5';
            button.style.color = 'white';
            button.style.padding = '8px 16px';
            button.style.borderRadius = '4px';
            button.style.textDecoration = 'none';
            button.style.fontWeight = 'bold';
            button.style.fontSize = '14px';
            button.style.display = 'inline-block';
            button.style.marginLeft = '16px';
            button.style.cursor = 'pointer';
            button.style.whiteSpace = 'nowrap';
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '&times;';
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.border = 'none';
            closeButton.style.color = '#999';
            closeButton.style.fontSize = '20px';
            closeButton.style.marginLeft = '12px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.padding = '0 4px';
            closeButton.onclick = () => {
              document.body.removeChild(popup);
            };
            
            // Assemble the popup
            popup.appendChild(description);
            popup.appendChild(button);
            popup.appendChild(closeButton);
            
            // Add to the page
            document.body.appendChild(popup);
          }, 3000);
        `;
        
        // Get the original URL to redirect to
        const newUrl = magicButton.original_url;
        
        if (newUrl) {
          console.log('Redirecting to:', newUrl);
          
          // Add script to the current page before redirecting
          document.head.appendChild(script);
          
          // Use a small delay before redirecting to ensure script is loaded
          setTimeout(() => {
            // Directly redirect to the target URL
            window.location.replace(newUrl);
          }, 100);
        } else {
          setError('Invalid magic button configuration.');
          setLoading(false);
        }
      } catch (err) {
        console.error('Magic button redirect error:', err);
        setError('An error occurred. Please try again.');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [buttonId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl">Redirecting you to the page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error && (
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
      )}
    </div>
  );
};

export default MagicButton;
