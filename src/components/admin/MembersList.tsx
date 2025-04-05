
import React from 'react';
import { useMembersData } from './members/useMembersData';
import SearchBar from './members/SearchBar';
import MembersTable from './members/MembersTable';
import EditLimitDialog from './members/EditLimitDialog';

const MembersList = () => {
  const {
    loading,
    refreshing,
    searchTerm,
    setSearchTerm,
    editMember,
    editLimit,
    setEditLimit,
    isDialogOpen,
    setIsDialogOpen,
    memberStats,
    refreshData,
    toggleMemberStatus,
    openEditLimitDialog,
    updateLinkLimit,
    filteredMembers
  } = useMembersData();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Registered Members</h2>
      
      <SearchBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        refreshData={refreshData}
        refreshing={refreshing}
      />

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>
      ) : (
        <MembersTable 
          filteredMembers={filteredMembers}
          memberStats={memberStats}
          toggleMemberStatus={toggleMemberStatus}
          openEditLimitDialog={openEditLimitDialog}
        />
      )}

      <EditLimitDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        editMember={editMember}
        editLimit={editLimit}
        setEditLimit={setEditLimit}
        updateLinkLimit={updateLinkLimit}
      />
    </div>
  );
};

export default MembersList;
