
import React from 'react';
import { Member, MemberStats } from './types';
import MemberRow from './MemberRow';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "@/components/ui/table";

interface MembersTableProps {
  filteredMembers: Member[];
  memberStats: Record<string, MemberStats>;
  toggleMemberStatus: (member: Member) => void;
  openEditLimitDialog: (member: Member) => void;
}

const MembersTable = ({
  filteredMembers,
  memberStats,
  toggleMemberStatus,
  openEditLimitDialog
}: MembersTableProps) => {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Total Links</TableHead>
            <TableHead>Total Clicks</TableHead>
            <TableHead>Links This Month</TableHead>
            <TableHead>Monthly Limit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                memberStats={memberStats[member.id]}
                toggleMemberStatus={toggleMemberStatus}
                openEditLimitDialog={openEditLimitDialog}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                No members found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
