
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/auth";

interface CreateUnlockerFormProps {
  onSuccess?: () => void;
}

const CreateUnlockerForm: React.FC<CreateUnlockerFormProps> = ({ onSuccess }) => {
  const [unlockerLink, setUnlockerLink] = React.useState('');
  const [destinationLink, setDestinationLink] = React.useState('');
  const [unlockerButtonText, setUnlockerButtonText] = React.useState('Click to Unlock');
  const [destinationButtonText, setDestinationButtonText] = React.useState('Go to Link');
  const [clickCount, setClickCount] = React.useState(1);
  const [countdownSeconds, setCountdownSeconds] = React.useState(5);
  const [description, setDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuthState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.from('link_unlockers').insert({
        user_id: user.id,
        unlocker_link: unlockerLink,  // Changed from unlocker_link to match camelCase
        destination_link: destinationLink,  // Changed from destination_link to match camelCase
        unlocker_button_text: unlockerButtonText,
        destination_button_text: destinationButtonText,
        click_count: Math.min(Math.max(clickCount, 1), 5),
        countdown_seconds: Math.min(Math.max(countdownSeconds, 1), 30),
        description: description.slice(0, 250)
      });

      if (error) throw error;

      toast({
        title: "Link Unlocker created successfully",
        description: "Your new Link Unlocker is ready to use"
      });

      // Reset form
      setUnlockerLink('');
      setDestinationLink('');
      setUnlockerButtonText('Click to Unlock');
      setDestinationButtonText('Go to Link');
      setClickCount(1);
      setCountdownSeconds(5);
      setDescription('');

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating link unlocker:', error);
      toast({
        title: "Error creating Link Unlocker",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="unlockerLink">First Link (Unlocker)</Label>
            <Input
              id="unlockerLink"
              placeholder="Enter the first link URL"
              value={unlockerLink}
              onChange={(e) => setUnlockerLink(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="destinationLink">Second Link (Destination)</Label>
            <Input
              id="destinationLink"
              placeholder="Enter the destination link URL"
              value={destinationLink}
              onChange={(e) => setDestinationLink(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="unlockerButtonText">First Button Text</Label>
            <Input
              id="unlockerButtonText"
              placeholder="Click to Unlock"
              value={unlockerButtonText}
              onChange={(e) => setUnlockerButtonText(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="destinationButtonText">Second Button Text</Label>
            <Input
              id="destinationButtonText"
              placeholder="Go to Link"
              value={destinationButtonText}
              onChange={(e) => setDestinationButtonText(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="clickCount">Required Clicks (1-5)</Label>
            <Input
              id="clickCount"
              type="number"
              min={1}
              max={5}
              value={clickCount}
              onChange={(e) => setClickCount(parseInt(e.target.value))}
              required
            />
          </div>
          <div>
            <Label htmlFor="countdownSeconds">Countdown Seconds (1-30)</Label>
            <Input
              id="countdownSeconds"
              type="number"
              min={1}
              max={30}
              value={countdownSeconds}
              onChange={(e) => setCountdownSeconds(parseInt(e.target.value))}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description (max 250 characters)</Label>
          <Textarea
            id="description"
            placeholder="Enter a description for your link unlocker"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={250}
            className="h-24"
          />
          <p className="text-sm text-muted-foreground mt-1">
            {description.length}/250 characters
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        Create Link Unlocker
      </Button>
    </form>
  );
};

export default CreateUnlockerForm;
