
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/auth";
import { Member, NotificationFormData } from './types';

export const useNotifications = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('is_active', true);

      if (error) throw error;

      if (data) {
        console.log("Fetched members for notifications:", data.length);
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
  }, [toast]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
    toast({
      description: "Member data refreshed"
    });
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
      console.log("Sending notification:", formData);

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

      if (notifError) {
        console.error("Error creating notification:", notifError);
        throw notifError;
      }

      if (!notifData) {
        console.error("Failed to create notification - no data returned");
        throw new Error("Failed to create notification");
      }
      
      console.log("Notification created successfully:", notifData);

      // If global notification, get all users
      if (formData.isGlobal) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_active', true);

        if (userError) {
          console.error("Error fetching users for global notification:", userError);
          throw userError;
        }

        if (userData && userData.length > 0) {
          console.log(`Creating notifications for ${userData.length} users`);
          
          // Create user_notification entries for all users
          const userNotifications = userData.map(user => ({
            user_id: user.id,
            notification_id: notifData.id
          }));

          const { error: bulkError } = await supabase
            .from('user_notifications')
            .insert(userNotifications);

          if (bulkError) {
            console.error("Error creating user notifications:", bulkError);
            throw bulkError;
          }
          
          console.log(`Successfully sent to ${userData.length} users`);
        }

        toast({
          title: "Notification sent",
          description: `Sent to ${userData?.length || 0} users`
        });
      } 
      // If individual notification
      else if (formData.recipient) {
        console.log(`Creating notification for user: ${formData.recipient}`);
        
        const { error: userNotifError } = await supabase
          .from('user_notifications')
          .insert({
            user_id: formData.recipient,
            notification_id: notifData.id
          });

        if (userNotifError) {
          console.error("Error creating user notification:", userNotifError);
          throw userNotifError;
        }
        
        console.log("Successfully sent to individual user");

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

  return {
    members,
    loading,
    refreshing,
    sendingNotification,
    selectedMember,
    isDialogOpen,
    formData,
    fetchMembers,
    refreshData,
    openSendNotification,
    setIsDialogOpen,
    handleInputChange,
    sendNotification
  };
};
