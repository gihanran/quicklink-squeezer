
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Member, NotificationFormData } from './types';

interface NotificationFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: NotificationFormData;
  selectedMember: Member | null;
  sendingNotification: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSendNotification: () => void;
}

const NotificationForm = ({ 
  isOpen, 
  setIsOpen, 
  formData, 
  selectedMember,
  sendingNotification,
  onInputChange, 
  onSendNotification 
}: NotificationFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formData.isGlobal 
              ? 'Send Notification to All Users' 
              : `Send Notification to ${selectedMember?.full_name || selectedMember?.email}`
            }
          </DialogTitle>
          <DialogDescription>
            This notification will be displayed in the user's dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Notification title"
              value={formData.title}
              onChange={onInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={onInputChange}
              rows={5}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onSendNotification}
            disabled={sendingNotification}
          >
            {sendingNotification ? 'Sending...' : 'Send Notification'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationForm;
