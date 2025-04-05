
import React from 'react';
import { Loader2 } from "lucide-react";
import { useProfileData } from "@/hooks/useProfileData";
import { PersonalInfoCard } from "./profile/PersonalInfoCard";
import { SecurityCard } from "./profile/SecurityCard";

const ProfileSection = () => {
  const {
    firstName,
    lastName,
    email,
    whatsappNumber,
    country,
    loading,
    profileLoading,
    mandatoryFieldsComplete,
    setFirstName,
    setLastName,
    setWhatsappNumber,
    setCountry,
    saveProfile,
    user
  } = useProfileData();

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonalInfoCard
          firstName={firstName}
          lastName={lastName}
          email={email}
          whatsappNumber={whatsappNumber}
          country={country}
          loading={loading}
          mandatoryFieldsComplete={mandatoryFieldsComplete}
          user={user}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setWhatsappNumber={setWhatsappNumber}
          setCountry={setCountry}
          saveProfile={saveProfile}
        />
        
        <SecurityCard />
      </div>
    </div>
  );
};

export default ProfileSection;
