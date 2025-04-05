
import React from 'react';
import { Member, MemberStats } from './types';
import { 
  TableRow, TableCell 
} from "@/components/ui/table";
import { ToggleLeft, ToggleRight, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberRowProps {
  member: Member;
  memberStats: MemberStats | undefined;
  toggleMemberStatus: (member: Member) => void;
  openEditLimitDialog: (member: Member) => void;
}

const MemberRow = ({ 
  member, 
  memberStats, 
  toggleMemberStatus, 
  openEditLimitDialog 
}: MemberRowProps) => {
  return (
    <TableRow key={member.id}>
      <TableCell className="font-mono text-xs">
        {member.id.split('-')[0]}...
      </TableCell>
      <TableCell>{member.full_name || 'N/A'}</TableCell>
      <TableCell>{member.email || 'N/A'}</TableCell>
      <TableCell>{member.country || 'N/A'}</TableCell>
      <TableCell>{memberStats?.linkCount || 0}</TableCell>
      <TableCell>{memberStats?.clickCount || 0}</TableCell>
      <TableCell>
        <span className={memberStats?.linksThisMonth >= member.link_limit ? 'text-red-600 font-bold' : ''}>
          {memberStats?.linksThisMonth || 0} / {member.link_limit}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-medium">{member.link_limit}</span>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          member.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {member.is_active ? 'Active' : 'Inactive'}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => toggleMemberStatus(member)}
            title={member.is_active ? 'Deactivate' : 'Activate'}
          >
            {member.is_active ? (
              <ToggleRight className="h-4 w-4 text-green-600" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-gray-500" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => openEditLimitDialog(member)}
            title="Edit Link Limit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MemberRow;
