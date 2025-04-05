
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Users, Send } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";

interface Member {
  id: string;
  email: string;
  full_name: string;
}

interface NotificationFormData {
  title: string;
  message: string;
  recipient: string | null;
  isGlobal: boolean;
}

const NotificationCenter = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    recipient: null,
    isGlobal: false
  });
  const { user } = useAuthState();
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('is_active', true);

      if (error) throw error;

      if (data) {
        setMembers(data as Member[]);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error loading members",
        description: "Could not load member data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openSendNotification = (member?: Member) => {
    if (member) {
      // Single user notification
      setFormData({
        title: '',
        message: '',
        recipient: member.id,
        isGlobal: false
      });
      setSelectedMember(member);
    } else {
      // Global notification
      setFormData({
        title: '',
        message: '',
        recipient: null,
        isGlobal: true
      });
      setSelectedMember(null);
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const sendNotification = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSendingNotification(true);

      // Insert notification
      const { data: notifData, error: notifError } = await supabase
        .from('notifications')
        .insert({
          title: formData.title,
          message: formData.message,
          is_global: formData.isGlobal,
          sender_id: user?.id
        })
        .select()
        .single();

      if (notifError) throw notifError;

      if (!notifData) throw new Error("Failed to create notification");

      // If global notification, get all users
      if (formData.isGlobal) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_active', true);

        if (userError) throw userError;

        if (userData && userData.length > 0) {
          // Create user_notification entries for all users
          const userNotifications = userData.map(user => ({
            user_id: user.id,
            notification_id: notifData.id
          }));

          const { error: bulkError } = await supabase
            .from('user_notifications')
            .insert(userNotifications);

          if (bulkError) throw bulkError;
        }

        toast({
          title: "Notification sent",
          description: `Sent to ${userData?.length || 0} users`
        });
      } 
      // If individual notification
      else if (formData.recipient) {
        const { error: userNotifError } = await supabase
          .from('user_notifications')
          .insert({
            user_id: formData.recipient,
            notification_id: notifData.id
          });

        if (userNotifError) throw userNotifError;

        toast({
          title: "Notification sent",
          description: "Notification sent successfully"
        });
      }

      setIsDialogOpen(false);
      setFormData({
        title: '',
        message: '',
        recipient: null,
        isGlobal: false
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error sending notification",
        description: "Failed to send notification",
        variant: "destructive"
      });
    } finally {
      setSendingNotification(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          onClick={() => openSendNotification()} 
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Send to All Users
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <User className="h-4 w-4 mr-2" />
                  {member.full_name || 'Unnamed User'}
                </CardTitle>
                <CardDescription className="truncate">{member.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => openSendNotification(member)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={sendNotification}
              disabled={sendingNotification}
            >
              {sendingNotification ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationCenter;
