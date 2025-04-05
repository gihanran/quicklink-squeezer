
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
  renameDialogOpen: boolean;
  setRenameDialogOpen: (open: boolean) => void;
  newShortCode: string;
  setNewShortCode: (code: string) => void;
  confirmRenameLink: () => Promise<void>;
}

const LinkDialogs: React.FC<LinkDialogsProps> = ({
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedLink,
  confirmDeleteLink,
  renameDialogOpen,
  setRenameDialogOpen,
  newShortCode,
  setNewShortCode,
  confirmRenameLink
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
      
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Link</DialogTitle>
            <DialogDescription>
              Enter a new custom code for your shortened link.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="shortCode" className="mb-2 block">Custom Short Code</Label>
            <div className="flex items-center space-x-1">
              <span className="text-gray-500">{window.location.origin}/s/</span>
              <Input
                id="shortCode"
                value={newShortCode}
                onChange={(e) => setNewShortCode(e.target.value)}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Only use letters, numbers, hyphens, and underscores
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRenameLink}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LinkDialogs;
