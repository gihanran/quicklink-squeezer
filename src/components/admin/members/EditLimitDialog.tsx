
import React from 'react';
import { Member } from './types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";

interface EditLimitDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editMember: Member | null;
  editLimit: number;
  setEditLimit: (limit: number) => void;
  updateLinkLimit: () => Promise<void>;
}

const EditLimitDialog = ({ 
  isOpen, 
  setIsOpen, 
  editMember, 
  editLimit, 
  setEditLimit, 
  updateLinkLimit 
}: EditLimitDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Link Limit</DialogTitle>
          <DialogDescription>
            Change the maximum number of links this user can create per month
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="linkLimit">Monthly Link Limit</Label>
          <Input
            id="linkLimit"
            type="number"
            value={editLimit}
            onChange={(e) => setEditLimit(parseInt(e.target.value) || 0)}
            min={0}
            className="mt-1"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={updateLinkLimit}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditLimitDialog;
