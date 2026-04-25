"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PatientCase } from "../types/CaseDetails.types";
import { DoctorRequestItem, SessionItem } from "../types/Sessions.types";
import { getCaseSessions, getDoctorCaseRequests } from "../server/sessions.action";
import { getDoctorById, getStudentById } from "@/server/getUsers.action";
import { DoctorDataResponse, StudentDataResponse } from "@/types/getUser.type";
import { getTokens } from "@/utils/sharedHelper";

interface CaseContextType {
  caseData: PatientCase | null;
  caseId: string | undefined;
  isLoading: boolean;
  refetch: () => void;

  // Sessions
  sessions: SessionItem[];
  sessionsLoading: boolean;
  sessionsPage: number;
  setSessionsPage: (page: number) => void;
  sessionsTotalPages: number;
  sessionsTotalCount: number;
  refetchSessions: () => void;

  doctorRequests: DoctorRequestItem[];
  doctorRequestsLoading: boolean;
  refetchDoctorRequests: () => void;

  doctorOwnerData: DoctorDataResponse | null;
  studentOwnerData: StudentDataResponse | null;
  creatorData: DoctorDataResponse | StudentDataResponse | null;
  userDataLoading: boolean;
  refetchUserData: () => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

interface CaseProviderProps {
  children: ReactNode;
  caseData: PatientCase | null;
  caseId: string | undefined;
  isLoading: boolean;
  refetch: () => void;
}

export const CaseProvider = ({ children, caseData, caseId, isLoading, refetch }: CaseProviderProps) => {
  const role = useSelector((state: RootState) => state.auth.role);
  const userId = useSelector((state: RootState) => state.auth.user?.publicId) || getTokens().cookieUserId;

  // ── Sessions state ──
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionsTotalPages, setSessionsTotalPages] = useState(1);
  const [sessionsTotalCount, setSessionsTotalCount] = useState(0);

  // ── Doctor requests state ──
  const [doctorRequests, setDoctorRequests] = useState<DoctorRequestItem[]>([]);
  const [doctorRequestsLoading, setDoctorRequestsLoading] = useState(false);

  // ── Info owner case data state ──
  const [doctorOwnerData, setDoctorOwnerData] = useState<DoctorDataResponse | null>(null);
  const [studentOwnerData, setStudentOwnerData] = useState<StudentDataResponse | null>(null);
  const [creatorData, setCreatorData] = useState<DoctorDataResponse | StudentDataResponse | null>(null);
  const [infoOwnerDataLoading, setInfoOwnerDataLoading] = useState(false);

  // ── Fetch sessions ──
  const fetchSessions = useCallback(async () => {
    if (!caseId) return;
    setSessionsLoading(true);
    try {
      const res = await getCaseSessions(caseId, { page: sessionsPage, pageSize: 10 });
      if (res.success && res.data) {
        setSessions(res.data.items);
        setSessionsTotalPages(res.data.totalPages);
        setSessionsTotalCount(res.data.totalCount);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, [caseId, sessionsPage]);

  // ── Fetch doctor requests ──
  const fetchDoctorRequests = useCallback(async () => {
    if (role !== "Doctor" || !caseData?.userFlags?.hasRequest || !userId) return;
    setDoctorRequestsLoading(true);
    try {
      const res = await getDoctorCaseRequests(userId, { page: 1, pageSize: 20 });
      if (res.success && res.data) {
        // Filter only requests for this specific case
        const filtered = res.data.items.filter(
          (r) => r.patientCasePublicId === caseId
        );
        setDoctorRequests(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch doctor requests:", err);
    } finally {
      setDoctorRequestsLoading(false);
    }
  }, [role, userId, caseId]);

  // ── Fetch info owner case data ──
  const fetchInfoOwnerCaseData = useCallback(async () => {
    if (!userId || !role || !caseId) return;
    setInfoOwnerDataLoading(true);
    try {
        const AssignedDoctorData = await getDoctorById(caseData?.assignedDoctorId || "");
        setDoctorOwnerData(AssignedDoctorData);
        const AssignedStudentData = await getStudentById(caseData?.assignedStudentId || "");
        setStudentOwnerData(AssignedStudentData);
        let CreatedUser: DoctorDataResponse | StudentDataResponse | null = null;
        const createdById = caseData?.createdById || "";
        if (caseData?.createdByRole === "Doctor") {
            CreatedUser = await getDoctorById(createdById);
        } else if (caseData?.createdByRole === "Student") {
            CreatedUser = await getStudentById(createdById);
        } else {
            CreatedUser = null;
        }
        setCreatorData(CreatedUser);

    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setInfoOwnerDataLoading(false);
    }
  }, [userId, role, caseId]);

  useEffect(() => {
    if (caseId && !isLoading) {
      fetchSessions();
    }
  }, [fetchSessions, caseId, isLoading]);

  useEffect(() => {
    if (caseId && !isLoading && role === "Doctor") {
      fetchDoctorRequests();
    }
  }, [fetchDoctorRequests, caseId, isLoading, role]);

  useEffect(() => {
    if (caseId && !isLoading) {
      fetchInfoOwnerCaseData();
    }
  }, [fetchInfoOwnerCaseData, caseId, isLoading]);

  return (
    <CaseContext.Provider
      value={{
        caseData,
        caseId,
        isLoading,
        refetch,
        sessions,
        sessionsLoading,
        sessionsPage,
        setSessionsPage,
        sessionsTotalPages,
        sessionsTotalCount,
        refetchSessions: fetchSessions,
        doctorRequests,
        doctorRequestsLoading,
        doctorOwnerData,
        studentOwnerData,
        creatorData,
        userDataLoading: infoOwnerDataLoading,
        refetchUserData: fetchInfoOwnerCaseData,
        refetchDoctorRequests: fetchDoctorRequests,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error("useCase must be used within a CaseProvider");
  }
  return context;
};