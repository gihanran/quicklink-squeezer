
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Users, RefreshCw } from "lucide-react";
import MembersList from './notifications/MembersList';
import NotificationForm from './notifications/NotificationForm';
import { useNotifications } from './notifications/useNotifications';

const NotificationCenter = () => {
  const {
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
  } = useNotifications();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
        
        <Button 
          variant="outline" 
          onClick={refreshData} 
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Members
        </Button>
      </div>

      <MembersList
        members={members}
        loading={loading}
        onSendNotification={openSendNotification}
      />

      <NotificationForm
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        formData={formData}
        selectedMember={selectedMember}
        sendingNotification={sendingNotification}
        onInputChange={handleInputChange}
        onSendNotification={sendNotification}
      />
    </div>
  );
};

export default NotificationCenter;
