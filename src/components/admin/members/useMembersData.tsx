
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Member, MemberStats } from './types';

export const useMembersData = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberStats, setMemberStats] = useState<Record<string, MemberStats>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editLimit, setEditLimit] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      if (data) {
        console.log("Fetched members:", data.length);
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
  }, [toast]);

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

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
    toast({
      description: "Member data refreshed"
    });
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

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.email?.toLowerCase().includes(searchLower) || 
      member.full_name?.toLowerCase().includes(searchLower) ||
      member.country?.toLowerCase().includes(searchLower)
    );
  });

  return {
    members,
    memberStats,
    loading,
    refreshing,
    searchTerm,
    setSearchTerm,
    editMember,
    editLimit,
    setEditLimit,
    isDialogOpen,
    setIsDialogOpen,
    fetchMembers,
    refreshData,
    toggleMemberStatus,
    openEditLimitDialog,
    updateLinkLimit,
    filteredMembers
  };
};
