
import React from 'react';
import MemberCard from './MemberCard';
import { Member } from './types';

interface MembersListProps {
  members: Member[];
  loading: boolean;
  onSendNotification: (member: Member) => void;
}

const MembersList = ({ members, loading, onSendNotification }: MembersListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <MemberCard 
          key={member.id} 
          member={member} 
          onSendNotification={onSendNotification}
        />
      ))}
    </div>
  );
};

export default MembersList;
