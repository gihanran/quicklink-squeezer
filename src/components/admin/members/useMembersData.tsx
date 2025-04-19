
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useMembersData = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [memberStats, setMemberStats] = useState<Record<string, { links: number, clicks: number, bioCards: number }>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editMember, setEditMember] = useState<any>(null);
  const [editLimit, setEditLimit] = useState<number>(10);
  const [editBioCardLimit, setEditBioCardLimit] = useState<number>(25);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBioCardDialogOpen, setIsBioCardDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMembers(data || []);

      // Fetch stats for each member
      const stats: Record<string, { links: number, clicks: number, bioCards: number }> = {};
      
      for (const member of data || []) {
        // Fetch link count and total clicks
        const { data: linksData } = await supabase
          .from('short_urls')
          .select('id, visits')
          .eq('user_id', member.id);

        const linkCount = linksData?.length || 0;
        const totalClicks = linksData?.reduce((sum, link) => sum + (link.visits || 0), 0) || 0;
        
        // Fetch bio cards count
        const { data: bioCardsData } = await supabase
          .from('bio_cards')
          .select('id')
          .eq('user_id', member.id);
        
        const bioCardsCount = bioCardsData?.length || 0;

        stats[member.id] = { 
          links: linkCount, 
          clicks: totalClicks,
          bioCards: bioCardsCount
        };
      }

      setMemberStats(stats);
    } catch (error: any) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch members',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  const toggleMemberStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setMembers(members.map(member => 
        member.id === id ? { ...member, is_active: isActive } : member
      ));

      toast({
        title: 'Status updated',
        description: `User has been ${isActive ? 'activated' : 'deactivated'}`
      });
    } catch (error: any) {
      console.error('Error toggling member status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      });
    }
  };

  const openEditLimitDialog = (member: any) => {
    setEditMember(member);
    setEditLimit(member.link_limit || 10);
    setIsDialogOpen(true);
  };

  const openBioCardLimitDialog = (member: any) => {
    setEditMember(member);
    setEditBioCardLimit(member.bio_card_limit || 25);
    setIsBioCardDialogOpen(true);
  };

  const updateLinkLimit = async () => {
    if (!editMember) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ link_limit: editLimit })
        .eq('id', editMember.id);

      if (error) throw error;

      // Update local state
      setMembers(members.map(member => 
        member.id === editMember.id ? { ...member, link_limit: editLimit } : member
      ));

      toast({
        title: 'Link limit updated',
        description: `User's link limit has been updated to ${editLimit}`
      });

      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating link limit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update link limit',
        variant: 'destructive'
      });
    }
  };

  const updateBioCardLimit = async () => {
    if (!editMember) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ bio_card_limit: editBioCardLimit })
        .eq('id', editMember.id);

      if (error) throw error;

      // Update local state
      setMembers(members.map(member => 
        member.id === editMember.id ? { ...member, bio_card_limit: editBioCardLimit } : member
      ));

      toast({
        title: 'Bio card limit updated',
        description: `User's bio card limit has been updated to ${editBioCardLimit}`
      });

      setIsBioCardDialogOpen(false);
    } catch (error: any) {
      console.error('Error updating bio card limit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bio card limit',
        variant: 'destructive'
      });
    }
  };

  // Filter members based on search term
  const filteredMembers = members.filter(member => {
    const searchable = [
      member.email,
      member.full_name,
      member.first_name,
      member.last_name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchable.includes(searchTerm.toLowerCase());
  });

  return {
    members,
    filteredMembers,
    memberStats,
    loading,
    refreshing,
    searchTerm,
    setSearchTerm,
    editMember,
    editLimit,
    setEditLimit,
    editBioCardLimit,
    setEditBioCardLimit,
    isDialogOpen,
    setIsDialogOpen,
    isBioCardDialogOpen,
    setIsBioCardDialogOpen,
    refreshData,
    toggleMemberStatus,
    openEditLimitDialog,
    openBioCardLimitDialog,
    updateLinkLimit,
    updateBioCardLimit
  };
};
