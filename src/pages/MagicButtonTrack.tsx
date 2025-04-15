
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const MagicButtonTrack: React.FC = () => {
  const { buttonId } = useParams<{ buttonId: string }>();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  
  useEffect(() => {
    if (!buttonId) {
      setError('Invalid button ID');
      setLoading(false);
      return;
    }
    
    const trackButtonClick = async () => {
      try {
        console.log(`Tracking click for button ID: ${buttonId}`);
        
        // First get the current click count
        const { data, error } = await supabase
          .from('magic_buttons')
          .select('clicks')
          .eq('id', buttonId)
          .maybeSingle();
        
        if (error) {
          console.error('Error getting click count:', error);
          setError('Failed to track click. An error occurred.');
          setLoading(false);
          return;
        }
        
        if (!data) {
          console.error('Magic button not found with ID:', buttonId);
          setError('Failed to track click. Button may not exist.');
          setLoading(false);
          return;
        }
        
        // Update the click count
        const newClickCount = (data.clicks || 0) + 1;
        console.log(`Updating clicks from ${data.clicks} to ${newClickCount}`);
        
        const { error: updateError } = await supabase
          .from('magic_buttons')
          .update({ clicks: newClickCount })
          .eq('id', buttonId);
        
        if (updateError) {
          console.error('Error updating click count:', updateError);
          setError('Failed to track click. An error occurred while updating.');
          setLoading(false);
          return;
        }
        
        setSuccess(true);
        setLoading(false);
        // Show success message but don't close the window automatically
        toast({
          title: "Click tracked successfully",
          description: "You can close this window now."
        });
        
      } catch (error) {
        console.error('Error tracking magic button click:', error);
        setError('An error occurred while tracking the click.');
        setLoading(false);
      }
    };
    
    trackButtonClick();
  }, [buttonId]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {loading ? (
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-xl">Tracking click...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="mb-6">{error}</p>
          <Link 
            to="/" 
            className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
          >
            Go back to homepage
          </Link>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-500 mb-4">Click Tracked Successfully</h1>
          <p className="mb-6">You can close this window now.</p>
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

export default MagicButtonTrack;
