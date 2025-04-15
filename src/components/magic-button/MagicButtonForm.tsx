
import React, { useState } from 'react';
import { useAuthState } from "@/hooks/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMagicButton } from "@/services/magicButtonService";
import { toast } from "@/hooks/use-toast";
import { LinkIcon, Type, PanelTop, ExternalLink } from "lucide-react";

interface MagicButtonFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

const MagicButtonForm: React.FC<MagicButtonFormProps> = ({ onComplete, onCancel }) => {
  const { user } = useAuthState();
  const [originalUrl, setOriginalUrl] = useState('');
  const [description, setDescription] = useState('');
  const [buttonTitle, setButtonTitle] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "You must be logged in",
        variant: "destructive"
      });
      return;
    }
    
    if (!originalUrl) {
      toast({
        title: "Webpage URL is required",
        variant: "destructive"
      });
      return;
    }
    
    if (!buttonTitle || !buttonUrl) {
      toast({
        title: "Button title and URL are required",
        variant: "destructive"
      });
      return;
    }
    
    if (description.length > 250) {
      toast({
        title: "Description must be under 250 characters",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const result = await createMagicButton({
        original_url: originalUrl,
        description,
        button_title: buttonTitle,
        button_url: buttonUrl,
        user_id: user.id
      });
      
      if (result) {
        onComplete();
      }
    } catch (error) {
      console.error("Error creating magic button:", error);
      toast({
        title: "Failed to create magic button",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Magic Button</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl" className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4" />
              Webpage URL
            </Label>
            <Input
              id="originalUrl"
              placeholder="https://example.com/article"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Enter the URL of the webpage where you want your magic button to appear
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center">
              <Type className="mr-2 h-4 w-4" />
              Description (max 250 characters)
            </Label>
            <Textarea
              id="description"
              placeholder="Add a short description about your offer..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={250}
              className="resize-none"
            />
            <p className="text-sm text-gray-500 flex justify-between">
              <span>This will appear in the popup under the webpage</span>
              <span>{description.length}/250</span>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="buttonTitle" className="flex items-center">
              <PanelTop className="mr-2 h-4 w-4" />
              Button Title
            </Label>
            <Input
              id="buttonTitle"
              placeholder="Get 20% Discount"
              value={buttonTitle}
              onChange={(e) => setButtonTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="buttonUrl" className="flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              Button URL
            </Label>
            <Input
              id="buttonUrl"
              placeholder="https://yourwebsite.com/affiliate-link"
              value={buttonUrl}
              onChange={(e) => setButtonUrl(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Users will be redirected to this URL when they click the button
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-brand-purple to-brand-blue"
            >
              {submitting ? 'Creating...' : 'Create Magic Button'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MagicButtonForm;
