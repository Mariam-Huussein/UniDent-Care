"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/server/getUsers.action";
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
  const router = useRouter();
  const role = useSelector((state: RootState) => state.auth.role);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // ClinicalDoctor has no profile page — redirect away
  if (role === "ClinicalDoctor") {
    router.replace("/cases");
    return null;
  }

  const { data: profileResp, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-profile", role],
    queryFn: getMyProfile,
    enabled: !!role && role !== "ClinicalDoctor",
    retry: 1,
  });

  const { data: universitiesResp } = useQuery({
    queryKey: ["universities"],
    queryFn: getUniversitiesLookup,
    staleTime: 1000 * 60 * 60,
  });

  if (!role || isLoading) return <ProfileSkeleton />;
  if (isError) return <ProfileError onRetry={refetch} t={t} />;

  const profileData = profileResp?.data;
  const universities = universitiesResp?.data || [];

  const isDoctor = role === "Doctor";
  const isStudent = role === "Student";
  const isPatient = role === "Patient";

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
      <ProfileHeader
        user={profileData}
        role={role}
        onEditClick={() => setIsEditModalOpen(true)}
        t={t}
      />

      <div className="w-full">
        {isDoctor  && <DoctorProfileView  doctor={profileData as any}  t={t} universities={universities} />}
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
