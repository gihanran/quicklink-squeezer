
import React from 'react';
import { UrlUnlocker } from '@/utils/unlocker/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { deleteUnlocker } from '@/utils/unlocker/unlockersUtil';

interface UnlockersListProps {
  unlockers: UrlUnlocker[];
  onDelete: (id: string) => void;
}

const UnlockersList: React.FC<UnlockersListProps> = ({ unlockers, onDelete }) => {
  const { toast } = useToast();

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/unlock/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied to clipboard",
      description: "Share it with your audience"
    });
  };

  const handleDeleteUnlocker = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this unlocker?");
    if (!confirmed) return;
    
    const success = await deleteUnlocker(id);
    if (success) {
      toast({
        title: "URL Unlocker deleted",
        description: "The unlocker has been permanently deleted"
      });
      onDelete(id);
    } else {
      toast({
        title: "Failed to delete unlocker",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (unlockers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You haven't created any URL unlockers yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {unlockers.map((unlocker) => (
        <Card key={unlocker.id} className="overflow-hidden shadow-md">
          <CardHeader className="bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 pb-4">
            <CardTitle className="flex justify-between items-start">
              <div className="truncate mr-2">
                {unlocker.title || unlocker.destinationUrl}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteUnlocker(unlocker.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Sequence ({unlocker.sequence.length} steps)</p>
                <div className="flex items-center gap-1">
                  {unlocker.sequence.map((color, index) => (
                    <div 
                      key={index}
                      className={`w-5 h-5 rounded-full ${
                        color === 'red' ? 'bg-red-500' : 
                        color === 'blue' ? 'bg-blue-500' : 
                        color === 'green' ? 'bg-green-500' : 
                        'bg-yellow-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <span>{unlocker.clicks} clicks</span>
                  <span>•</span>
                  <span>{unlocker.unlocks} unlocks</span>
                </div>
                <p className="text-xs text-gray-400">
                  Created {formatDistanceToNow(unlocker.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleCopyLink(unlocker.id)}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(`/unlock/${unlocker.id}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" /> Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UnlockersList;
