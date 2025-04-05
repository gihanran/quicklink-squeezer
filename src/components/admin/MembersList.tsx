
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableHeader, TableBody, TableHead, 
  TableRow, TableCell
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ToggleLeft, ToggleRight, Pencil } from "lucide-react";

interface Member {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  link_limit: number;
  created_at: string;
  whatsapp_number: string | null;
  country: string | null;
  has_completed_profile: boolean;
}

interface MemberStats {
  id: string;
  linkCount: number;
  clickCount: number;
  linksThisMonth: number; // New field to track monthly usage
}

const MembersList = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberStats, setMemberStats] = useState<Record<string, MemberStats>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editLimit, setEditLimit] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      if (data) {
        setMembers(data as Member[]);
        fetchMemberStats(data as Member[]);
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

  const fetchMemberStats = async (members: Member[]) => {
    try {
      // Fetch link counts and click counts for each member
      const stats: Record<string, MemberStats> = {};
      
      // Get start of current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      for (const member of members) {
        // Get link count
        const { data: linkData, error: linkError } = await supabase
          .from('short_urls')
          .select('id, visits')
          .eq('user_id', member.id);

        if (linkError) throw linkError;

        // Get monthly link count
        const { count: monthlyCount, error: monthlyError } = await supabase
          .from('short_urls')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', member.id)
          .gte('created_at', startOfMonth.toISOString());
        
        if (monthlyError) throw monthlyError;

        const linkCount = linkData?.length || 0;
        const clickCount = linkData?.reduce((sum, link) => sum + (link.visits || 0), 0) || 0;
        const linksThisMonth = monthlyCount || 0;

        stats[member.id] = {
          id: member.id,
          linkCount,
          clickCount,
          linksThisMonth
        };
      }

      setMemberStats(stats);
    } catch (error) {
      console.error('Error fetching member stats:', error);
    }
  };

  const toggleMemberStatus = async (member: Member) => {
    try {
      const newStatus = !member.is_active;
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newStatus })
        .eq('id', member.id);

      if (error) throw error;

      setMembers(members.map(m => 
        m.id === member.id ? { ...m, is_active: newStatus } : m
      ));

      toast({
        title: `Member ${newStatus ? 'activated' : 'deactivated'}`,
        description: `${member.email} has been ${newStatus ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error toggling member status:', error);
      toast({
        title: "Error updating member",
        description: "Could not update member status",
        variant: "destructive"
      });
    }
  };

  const openEditLimitDialog = (member: Member) => {
    setEditMember(member);
    setEditLimit(member.link_limit);
    setIsDialogOpen(true);
  };

  const updateLinkLimit = async () => {
    if (!editMember) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ link_limit: editLimit })
        .eq('id', editMember.id);

      if (error) throw error;

      setMembers(members.map(m => 
        m.id === editMember.id ? { ...m, link_limit: editLimit } : m
      ));

      toast({
        title: "Link limit updated",
        description: `${editMember.email}'s link limit has been updated to ${editLimit}`,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating link limit:', error);
      toast({
        title: "Error updating limit",
        description: "Could not update member's link limit",
        variant: "destructive"
      });
    }
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.email?.toLowerCase().includes(searchLower) || 
      member.full_name?.toLowerCase().includes(searchLower) ||
      member.country?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Registered Members</h2>
      
      <div className="mb-6">
        <Input
          placeholder="Search by name, email or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>
      ) : (
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
                  <TableRow key={member.id}>
                    <TableCell className="font-mono text-xs">
                      {member.id.split('-')[0]}...
                    </TableCell>
                    <TableCell>{member.full_name || 'N/A'}</TableCell>
                    <TableCell>{member.email || 'N/A'}</TableCell>
                    <TableCell>{member.country || 'N/A'}</TableCell>
                    <TableCell>{memberStats[member.id]?.linkCount || 0}</TableCell>
                    <TableCell>{memberStats[member.id]?.clickCount || 0}</TableCell>
                    <TableCell>
                      <span className={memberStats[member.id]?.linksThisMonth >= member.link_limit ? 'text-red-600 font-bold' : ''}>
                        {memberStats[member.id]?.linksThisMonth || 0} / {member.link_limit}
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
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Link Limit</DialogTitle>
            <DialogDescription>
              Change the maximum number of links this user can create per month
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="linkLimit">Monthly Link Limit</Label>
            <Input
              id="linkLimit"
              type="number"
              value={editLimit}
              onChange={(e) => setEditLimit(parseInt(e.target.value) || 0)}
              min={0}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateLinkLimit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MembersList;
