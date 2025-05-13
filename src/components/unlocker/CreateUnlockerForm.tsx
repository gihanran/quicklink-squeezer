
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUrlUnlocker } from '@/utils/unlocker/unlockersUtil';
import { ButtonColor } from '@/utils/unlocker/types';
import { X, Plus, Trash2 } from "lucide-react";

interface CreateUnlockerFormProps {
  onSuccess?: () => void;
}

const CreateUnlockerForm: React.FC<CreateUnlockerFormProps> = ({ onSuccess }) => {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [sequence, setSequence] = useState<ButtonColor[]>(['red', 'blue']);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddStep = () => {
    if (sequence.length >= 10) {
      toast({
        title: "Maximum steps reached",
        description: "You can have a maximum of 10 steps in the sequence",
        variant: "destructive"
      });
      return;
    }
    setSequence([...sequence, 'red']);
  };

  const handleRemoveStep = (index: number) => {
    if (sequence.length <= 2) {
      toast({
        title: "Minimum steps required",
        description: "You need at least 2 steps in the sequence",
      });
      return;
    }
    const newSequence = [...sequence];
    newSequence.splice(index, 1);
    setSequence(newSequence);
  };

  const handleColorChange = (index: number, color: ButtonColor) => {
    const newSequence = [...sequence];
    newSequence[index] = color;
    setSequence(newSequence);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinationUrl.trim()) {
      toast({ 
        title: "Please enter a destination URL",
        variant: "destructive"
      });
      return;
    }
    
    let url = destinationUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    try {
      setIsLoading(true);
      const result = await createUrlUnlocker(url, title || undefined, sequence);
      
      if (result) {
        setDestinationUrl('');
        setTitle('');
        setSequence(['red', 'blue']);
        
        toast({
          title: "URL Unlocker created successfully!",
          description: "Share it with your audience to increase engagement."
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast({ 
        title: "Failed to create URL unlocker",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="destination-url">Destination URL</Label>
        <Input
          id="destination-url"
          type="text"
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title (Optional)</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Special Link"
          className="w-full"
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Button Sequence</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleAddStep}
            disabled={isLoading || sequence.length >= 10}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </div>
        
        <div className="space-y-3">
          {sequence.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-medium w-6">#{index + 1}</span>
                {['red', 'blue', 'green', 'yellow'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-8 h-8 rounded-full ${
                      c === 'red' ? 'bg-red-500' : 
                      c === 'blue' ? 'bg-blue-500' : 
                      c === 'green' ? 'bg-green-500' : 
                      'bg-yellow-500'
                    } ${color === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                    onClick={() => handleColorChange(index, c as ButtonColor)}
                    disabled={isLoading}
                  />
                ))}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveStep(index)}
                disabled={isLoading || sequence.length <= 2}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-90 transition-opacity"
        disabled={isLoading}
      >
        Create URL Unlocker
      </Button>
    </form>
  );
};

export default CreateUnlockerForm;
