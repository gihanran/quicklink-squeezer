
import React from 'react';
import { useMembersData } from './members/useMembersData';
import SearchBar from './members/SearchBar';
import MembersTable from './members/MembersTable';
import EditLimitDialog from './members/EditLimitDialog';
import BioCardLimitDialog from './members/BioCardLimitDialog';

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
    isBioCardDialogOpen,
    setIsBioCardDialogOpen,
    editBioCardLimit,
    setEditBioCardLimit,
    memberStats,
    refreshData,
    toggleMemberStatus,
    openEditLimitDialog,
    updateLinkLimit,
    openBioCardLimitDialog,
    updateBioCardLimit,
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
          openBioCardLimitDialog={openBioCardLimitDialog}
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

      <BioCardLimitDialog
        isOpen={isBioCardDialogOpen}
        setIsOpen={setIsBioCardDialogOpen}
        editMember={editMember}
        editLimit={editBioCardLimit}
        setEditLimit={setEditBioCardLimit}
        updateBioCardLimit={updateBioCardLimit}
      />
    </div>
  );
};

export default MembersList;
