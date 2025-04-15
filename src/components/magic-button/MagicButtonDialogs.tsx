
import React, { useState, useEffect } from 'react';
import { MagicButton } from "@/types/magicButton";
import { updateMagicButton, deleteMagicButton } from "@/services/magicButtonService";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface MagicButtonDialogsProps {
  selectedButton: MagicButton | null;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  onUpdateComplete: () => void;
  onDeleteComplete: () => void;
}

const MagicButtonDialogs: React.FC<MagicButtonDialogsProps> = ({
  selectedButton,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  onUpdateComplete,
  onDeleteComplete
}) => {
  const [description, setDescription] = useState('');
  const [buttonTitle, setButtonTitle] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  useEffect(() => {
    if (selectedButton && editDialogOpen) {
      setDescription(selectedButton.description || '');
      setButtonTitle(selectedButton.button_title || '');
      setButtonUrl(selectedButton.button_url || '');
    }
  }, [selectedButton, editDialogOpen]);
  
  const handleUpdate = async () => {
    if (!selectedButton) return;
    
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
      
      const result = await updateMagicButton(selectedButton.id, {
        description,
        button_title: buttonTitle,
        button_url: buttonUrl
      });
      
      if (result) {
        onUpdateComplete();
      }
    } catch (error) {
      console.error("Error updating magic button:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedButton) return;
    
    try {
      setDeleting(true);
      
      const success = await deleteMagicButton(selectedButton.id);
      
      if (success) {
        onDeleteComplete();
      }
    } catch (error) {
      console.error("Error deleting magic button:", error);
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Magic Button</DialogTitle>
            <DialogDescription>
              Update the details of your magic button
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">
                Description (max 250 characters)
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={250}
                className="resize-none"
              />
              <div className="text-sm text-gray-500 flex justify-end">
                {description.length}/250
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-buttonTitle">Button Title</Label>
              <Input
                id="edit-buttonTitle"
                value={buttonTitle}
                onChange={(e) => setButtonTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-buttonUrl">Button URL</Label>
              <Input
                id="edit-buttonUrl"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={submitting}
              className="bg-gradient-to-r from-brand-purple to-brand-blue"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Magic Button</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this magic button? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MagicButtonDialogs;
