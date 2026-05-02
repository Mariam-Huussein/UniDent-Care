"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getStudentById, getDoctorById, getPatientById } from "@/server/getUsers.action";
import { getUniversitiesLookup } from "@/server/getUniversities.action";

import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileSkeleton } from "@/features/profile/components/ProfileSkeleton";
import { ProfileError } from "@/features/profile/components/ProfileError";
import { DoctorProfileView } from "@/features/profile/components/DoctorProfileView";
import { StudentProfileView } from "@/features/profile/components/StudentProfileView";
import { PatientProfileView } from "@/features/profile/components/PatientProfileView";
import { EditProfileModal } from "@/features/profile/components/EditProfileModal";

export default function Profile() {
  const { t } = useLanguage();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch full user details based on role
  const { data: fullUserData, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', role, user?.publicId],
    queryFn: async () => {
      if (!user?.publicId) throw new Error("No User ID");
      if (role === 'Doctor') return await getDoctorById(user.publicId);
      if (role === 'Student') return await getStudentById(user.publicId);
      if (role === 'Patient') return await getPatientById(user.publicId);
      throw new Error("Invalid Role");
    },
    enabled: !!user?.publicId && !!role,
    retry: 1
  });

  const { data: universitiesResp } = useQuery({
    queryKey: ['universities'],
    queryFn: getUniversitiesLookup,
    staleTime: 1000 * 60 * 60, // 1 hour cache
  });

  if (!user || !role) {
    return <ProfileSkeleton />;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return <ProfileError onRetry={refetch} t={t} />;
  }

  const isDoctor = role === "Doctor";
  const isStudent = role === "Student";
  const isPatient = role === "Patient";

  // Use the fetched full data or fallback to the partial Redux state data
  // fullUserData is an ApiResponse, so the actual user info is in fullUserData.data
  const fetchedData = fullUserData?.data;
  const profileData = fetchedData || user;
  const universities = universitiesResp?.data || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      <ProfileHeader 
        user={profileData} 
        role={role} 
        onEditClick={() => setIsEditModalOpen(true)} 
        t={t} 
      />

      <div className="w-full">
        {isDoctor && <DoctorProfileView doctor={profileData as any} t={t} universities={universities} />}
        {isStudent && <StudentProfileView student={profileData as any} t={t} universities={universities} />}
        {isPatient && <PatientProfileView patient={profileData as any} t={t} />}
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        role={role}
        userData={profileData}
        t={t}
        universities={universities}
      />
    </div>
  );
}