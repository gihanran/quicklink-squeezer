
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BioCardLimitDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editMember: any;
  editLimit: number;
  setEditLimit: (limit: number) => void;
  updateBioCardLimit: () => void;
}

const BioCardLimitDialog: React.FC<BioCardLimitDialogProps> = ({
  isOpen,
  setIsOpen,
  editMember,
  editLimit,
  setEditLimit,
  updateBioCardLimit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBioCardLimit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Bio Card Limit</DialogTitle>
          <DialogDescription>
            Change the maximum number of bio cards this user can create.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <div className="font-medium">{editMember?.email}</div>
                <div className="text-sm text-gray-500">
                  {editMember?.full_name || 'No name provided'}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="bioCardLimit">Bio Card Limit</Label>
              <Input
                id="bioCardLimit"
                type="number"
                min="1"
                max="100"
                value={editLimit}
                onChange={(e) => setEditLimit(parseInt(e.target.value))}
              />
              <p className="text-sm text-gray-500">
                Current limit: {editMember?.bio_card_limit || 25} bio cards
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Limit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BioCardLimitDialog;
