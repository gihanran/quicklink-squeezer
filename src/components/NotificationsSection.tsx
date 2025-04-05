
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/auth";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  notificationId: string;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthState();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fixed query to properly join notification table data
      const { data, error } = await supabase
        .from('user_notifications')
        .select(`
          id,
          notification_id,
          is_read,
          notifications:notification_id (
            title,
            message,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('is_read', { ascending: true })
        .order('notifications.created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedNotifications = data.map(item => ({
          id: item.id,
          notificationId: item.notification_id,
          title: item.notifications.title,
          message: item.notifications.message,
          created_at: item.notifications.created_at,
          is_read: item.is_read
        }));
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error loading notifications",
        description: "Could not load your notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      // Update local state
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));

      toast({
        description: "Notification marked as read"
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Could not update notification status",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    if (notifications.filter(n => !n.is_read).length === 0) return;
    
    try {
      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id);

      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .in('id', unreadIds);

      if (error) throw error;

      // Update local state
      setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));

      toast({
        description: "All notifications marked as read"
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: "Error",
        description: "Could not update notifications status",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">Notifications and messages from the system</p>
        </div>
        <Button 
          variant="outline" 
          onClick={markAllAsRead}
          className="mt-4 md:mt-0"
          disabled={!notifications.some(n => !n.is_read)}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No notifications</h3>
            <p className="text-gray-500">You don't have any notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`overflow-hidden ${!notification.is_read ? 'border-l-4 border-l-brand-purple' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-medium ${!notification.is_read ? 'text-brand-purple' : ''}`}>
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{notification.message}</p>
                {!notification.is_read && (
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark as read
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsSection;
