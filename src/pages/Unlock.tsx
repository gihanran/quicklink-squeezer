
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUnlockerById, trackUnlockerClick } from '@/utils/unlocker/unlockersUtil';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import { UrlUnlocker } from '@/utils/unlocker/types';
import MetaTags from '@/components/MetaTags';
import Footer from '@/components/Footer';
import LoadingState from '@/components/unlocker/view/LoadingState';
import ErrorState from '@/components/unlocker/view/ErrorState';
import ExpiredState from '@/components/unlocker/view/ExpiredState';
import UnlockContent from '@/components/unlocker/view/UnlockContent';

const Unlock: React.FC = () => {
  const { unlockerId } = useParams<{ unlockerId: string }>();
  const [unlocker, setUnlocker] = useState<UrlUnlocker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [sequenceProgress, setSequenceProgress] = useState<number>(0);
  const [unlocked, setUnlocked] = useState<boolean>(false);

  useEffect(() => {
    if (!unlockerId) {
      setError('Invalid unlocker ID');
      setLoading(false);
      return;
    }

    const fetchUnlocker = async () => {
      try {
        setLoading(true);
        const data = await getUnlockerById(unlockerId);
        
        if (!data) {
          setError('This unlocker link does not exist');
          return;
        }
        
        // Check if the link is expired
        const expirationDate = new Date(data.expirationDate);
        const now = new Date();
        
        if (expirationDate < now) {
          setIsExpired(true);
          setError('This link has expired');
          setUnlocker(data);
          return;
        }
        
        setUnlocker(data);
        setUnlocked(data.unlocks > 0);
        
        // Track click
        await trackUnlockerClick(unlockerId);
      } catch (err) {
        console.error('Error fetching unlocker:', err);
        setError('Failed to load unlocker');
      } finally {
        setLoading(false);
      }
    };

    fetchUnlocker();
  }, [unlockerId]);

  const handleSequenceChange = (progress: number) => {
    setSequenceProgress(progress);
    if (unlocker && progress === unlocker.sequence.length) {
      setUnlocked(true);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (isExpired) {
    return <ExpiredState />;
  }

  if (error || !unlocker) {
    return <ErrorState title="Unlocker Not Found" message={error || 'This unlocker link does not exist'} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto max-w-md px-4 py-12">
        <MetaTags 
          title={unlocker.title || "Unlock Content"} 
          description="Complete the sequence to unlock this content"
        />
        
        <Card className="shadow-lg border-none">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                {unlocker.title || "Unlock Content"}
              </h1>
              <p className="text-gray-500">
                {unlocked 
                  ? "Congratulations! You've unlocked the content." 
                  : `Complete the button sequence (${sequenceProgress}/${unlocker.sequence.length})`}
              </p>
            </div>
            
            <UnlockContent 
              unlocker={unlocker} 
              onSequenceChange={handleSequenceChange}
            />
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link to="/" className="flex items-center justify-center text-brand-purple hover:underline">
            <span>Powered by ShortIt</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unlock;
