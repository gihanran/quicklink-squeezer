
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkDialogsProps {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedLink: any;
  confirmDeleteLink: () => Promise<void>;
  titleDialogOpen: boolean;
  setTitleDialogOpen: (open: boolean) => void;
  newTitle: string;
  setNewTitle: (title: string) => void;
  confirmUpdateTitle: () => Promise<void>;
}

const LinkDialogs: React.FC<LinkDialogsProps> = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedLink,
  confirmDeleteLink,
  titleDialogOpen,
  setTitleDialogOpen,
  newTitle,
  setNewTitle,
  confirmUpdateTitle
}) => {
  return (
    <>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this link? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 p-3 rounded-md my-4">
            <p className="text-sm font-medium">{selectedLink?.originalUrl}</p>
            <p className="text-xs text-gray-500">
              {window.location.origin}/s/{selectedLink?.shortCode}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteLink}>
              Delete Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link Title</DialogTitle>
            <DialogDescription>
              Enter a title for your shortened link to make it easier to recognize.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="linkTitle" className="mb-2 block">Link Title</Label>
            <Input
              id="linkTitle"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1"
              placeholder="Enter a descriptive title"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTitleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdateTitle}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkDialogs;
