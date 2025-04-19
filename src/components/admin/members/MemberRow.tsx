
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { 
  Link2, 
  MousePointer, 
  ToggleLeft, 
  ToggleRight, 
  Settings,
  Layout
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MemberRowProps {
  member: any;
  stats: {
    links: number;
    clicks: number;
    bioCards: number;
  };
  toggleMemberStatus: (id: string, isActive: boolean) => void;
  openEditLimitDialog: (member: any) => void;
  openBioCardLimitDialog: (member: any) => void;
}

const MemberRow: React.FC<MemberRowProps> = ({
  member,
  stats,
  toggleMemberStatus,
  openEditLimitDialog,
  openBioCardLimitDialog
}) => {
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.avatar_url} alt={member.full_name} />
            <AvatarFallback>
              {getInitials(member.full_name || member.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{member.email}</div>
            <div className="text-sm text-gray-500">
              {member.full_name || 'No name provided'}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center gap-1">
            <Link2 className="h-4 w-4 text-gray-500" />
            <span>{stats?.links || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MousePointer className="h-4 w-4 text-gray-500" />
            <span>{stats?.clicks || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Layout className="h-4 w-4 text-gray-500" />
            <span>{stats?.bioCards || 0}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {member.created_at
            ? formatDistanceToNow(new Date(member.created_at), { addSuffix: true })
            : 'Unknown'}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm flex gap-1">
            <span className="font-medium">Links:</span> {member.link_limit || 10}
          </div>
          <div className="text-sm flex gap-1">
            <span className="font-medium">Bio Cards:</span> {member.bio_card_limit || 25}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openEditLimitDialog(member)}>
              <Link2 className="h-4 w-4 mr-2" />
              Edit Link Limit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openBioCardLimitDialog(member)}>
              <Layout className="h-4 w-4 mr-2" />
              Edit Bio Card Limit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toggleMemberStatus(member.id, !member.is_active)}
            >
              {member.is_active ? (
                <>
                  <ToggleRight className="h-4 w-4 mr-2" />
                  Deactivate User
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 mr-2" />
                  Activate User
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default MemberRow;
