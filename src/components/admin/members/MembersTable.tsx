
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import MemberRow from './MemberRow';

interface MembersTableProps {
  filteredMembers: any[];
  memberStats: Record<string, { links: number, clicks: number, bioCards: number }>;
  toggleMemberStatus: (id: string, isActive: boolean) => void;
  openEditLimitDialog: (member: any) => void;
  openBioCardLimitDialog: (member: any) => void;
}

const MembersTable: React.FC<MembersTableProps> = ({
  filteredMembers,
  memberStats,
  toggleMemberStatus,
  openEditLimitDialog,
  openBioCardLimitDialog
}) => {
  if (filteredMembers.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50 mt-4">
        <p className="text-gray-500">No members found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">User</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Limits</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              stats={memberStats[member.id]}
              toggleMemberStatus={toggleMemberStatus}
              openEditLimitDialog={openEditLimitDialog}
              openBioCardLimitDialog={openBioCardLimitDialog}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
