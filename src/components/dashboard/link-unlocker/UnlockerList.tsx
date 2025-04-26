
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, ExternalLink, Copy } from 'lucide-react';

interface UnlockerLink {
  id: string;
  unlocker_link: string;
  destination_link: string;
  unlocker_button_text: string;
  destination_button_text: string;
  click_count: number;
  countdown_seconds: number;
  description: string;
  visits: number;
  unlocks: number;
}

interface UnlockerListProps {
  unlockers: UnlockerLink[];
  onDelete: (id: string) => void;
}

const UnlockerList: React.FC<UnlockerListProps> = ({ unlockers, onDelete }) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;

  const handleCopy = (id: string) => {
    const url = `${baseUrl}/u/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Link has been copied to your clipboard"
      });
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Link Unlocker?')) return;

    try {
      const { error } = await supabase
        .from('link_unlockers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onDelete(id);
      toast({
        title: "Link Unlocker deleted",
        description: "The Link Unlocker has been permanently deleted"
      });
    } catch (error) {
      console.error('Error deleting link unlocker:', error);
      toast({
        title: "Error deleting Link Unlocker",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (unlockers.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6 text-center text-muted-foreground">
          No Link Unlockers created yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      {unlockers.map((unlocker) => (
        <Card key={unlocker.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                {unlocker.destination_button_text}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(unlocker.id)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(`/u/${unlocker.id}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(unlocker.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="text-sm">
                <p className="text-muted-foreground">{unlocker.description}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Required Clicks</p>
                  <p className="text-2xl font-bold">{unlocker.click_count}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Countdown</p>
                  <p className="text-2xl font-bold">{unlocker.countdown_seconds}s</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Visits</p>
                  <p className="text-2xl font-bold">{unlocker.visits}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Unlocks</p>
                  <p className="text-2xl font-bold">{unlocker.unlocks}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UnlockerList;
