
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUnlockerById, trackUnlockerClick, trackUnlockerSuccess } from '@/utils/unlocker/unlockersUtil';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check, ArrowRight, Clock } from 'lucide-react';
import { ButtonColor, UrlUnlocker } from '@/utils/unlocker/types';
import MetaTags from '@/components/MetaTags';
import Footer from '@/components/Footer';

const Unlock: React.FC = () => {
  const { unlockerId } = useParams<{ unlockerId: string }>();
  const [unlocker, setUnlocker] = useState<UrlUnlocker | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [userSequence, setUserSequence] = useState<ButtonColor[]>([]);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [isExpired, setIsExpired] = useState<boolean>(false);

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

  const handleButtonClick = (color: ButtonColor) => {
    if (unlocked || !unlocker || isExpired) return;
    
    const newSequence = [...userSequence, color];
    setUserSequence(newSequence);
    
    // Check if the sequence matches so far
    const currentStep = userSequence.length;
    if (unlocker.sequence[currentStep] !== color) {
      // Incorrect sequence, reset
      setUserSequence([]);
      return;
    }
    
    // Check if sequence is complete
    if (newSequence.length === unlocker.sequence.length) {
      setUnlocked(true);
      trackUnlockerSuccess(unlocker.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <MetaTags title="Loading..." />
            <div className="mb-4 animate-pulse">
              <div className="h-12 w-12 mx-auto border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xl">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <MetaTags title="Link Expired" />
            <div className="bg-amber-100 rounded-full p-3 inline-flex mb-4">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-amber-600 mb-4">Link Expired</h1>
            <p className="mb-6">This URL unlocker link has expired and is no longer available.</p>
            <Link 
              to="/" 
              className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
            >
              Go back to homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !unlocker) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <MetaTags title="Unlocker Not Found" />
            <h1 className="text-2xl font-bold text-red-500 mb-4">Unlocker Not Found</h1>
            <p className="mb-6">{error || 'This unlocker link does not exist'}</p>
            <Link 
              to="/" 
              className="px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
            >
              Go back to homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
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
                  : `Complete the button sequence (${userSequence.length}/${unlocker.sequence.length})`}
              </p>
            </div>
            
            {!unlocked ? (
              <div className="space-y-6">
                <div className="flex justify-center space-x-4 mb-4">
                  {["red", "blue", "green", "yellow"].map((color) => (
                    <button
                      key={color}
                      className={`w-14 h-14 rounded-full ${
                        color === "red" ? "bg-red-500" : 
                        color === "blue" ? "bg-blue-500" : 
                        color === "green" ? "bg-green-500" : 
                        "bg-yellow-500"
                      } shadow-lg hover:scale-110 transition-transform`}
                      onClick={() => handleButtonClick(color as ButtonColor)}
                    />
                  ))}
                </div>
                
                <div className="mt-8">
                  <div className="flex justify-center space-x-2">
                    {unlocker.sequence.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-3 h-3 rounded-full ${
                          index < userSequence.length 
                            ? userSequence[index] === unlocker.sequence[index] 
                              ? 'bg-green-500' 
                              : 'bg-red-500' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="bg-green-100 rounded-full p-3">
                    <Check className="h-12 w-12 text-green-500" />
                  </div>
                </div>
                
                <a 
                  href={unlocker.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-block px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-blue text-white rounded-md hover:opacity-90"
                >
                  <div className="flex items-center">
                    <span>Visit Unlocked Content</span>
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </div>
                </a>
              </div>
            )}
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
