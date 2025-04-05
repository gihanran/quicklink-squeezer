
import React from 'react';
import { User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Member } from './types';

interface MemberCardProps {
  member: Member;
  onSendNotification: (member: Member) => void;
}

const MemberCard = ({ member, onSendNotification }: MemberCardProps) => {
  return (
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
          onClick={() => onSendNotification(member)}
        >
          <Send className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
