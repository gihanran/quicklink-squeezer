
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

const Unlocker = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unlocker, setUnlocker] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const fetchUnlocker = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('link_unlockers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Link not found');

        setUnlocker(data);
        
        // Increment visits count
        await supabase
          .from('link_unlockers')
          .update({ visits: data.visits + 1 })
          .eq('id', id);

      } catch (error) {
        console.error('Error fetching unlocker:', error);
        setError('Link not found or has been removed');
      } finally {
        setLoading(false);
      }
    };

    fetchUnlocker();
  }, [id]);

  const handleUnlockerClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= (unlocker?.click_count || 1)) {
      setCountdown(unlocker?.countdown_seconds || 5);

      // Open the unlocker link in a new window
      window.open(unlocker.unlocker_link, '_blank');
    }
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setUnlocked(true);
      supabase
        .from('link_unlockers')
        .update({ unlocks: (unlocker?.unlocks || 0) + 1 })
        .eq('id', id);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, id, unlocker?.unlocks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 space-y-6">
          {unlocker.description && (
            <p className="text-center text-gray-600">{unlocker.description}</p>
          )}
          
          <div className="space-y-4">
            <Button
              className="w-full h-12 text-lg"
              onClick={handleUnlockerClick}
              disabled={clickCount >= (unlocker?.click_count || 1)}
            >
              {unlocker.unlocker_button_text}
              {clickCount > 0 && clickCount < unlocker.click_count && (
                ` (${unlocker.click_count - clickCount} more)`
              )}
            </Button>

            {countdown !== null && countdown > 0 && (
              <p className="text-center text-lg font-semibold">
                Please wait {countdown} seconds...
              </p>
            )}

            <Button
              className="w-full h-12 text-lg"
              disabled={!unlocked}
              onClick={() => window.location.href = unlocker.destination_link}
            >
              {unlocker.destination_button_text}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unlocker;
