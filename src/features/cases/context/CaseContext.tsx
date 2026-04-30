"use client";

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PatientCase } from "../types/CaseDetails.types";
import { DoctorRequestItem, SessionItem } from "../types/Sessions.types";
import { getCaseSessions } from "../server/sessions.action";
import { getDoctorMyCaseRequests } from "../server/caseRequest.action";
import { getDoctorById, getStudentById } from "@/server/getUsers.action";
import { DoctorDataResponse, StudentDataResponse } from "@/types/getUser.type";
import { getTokensAndUserId } from "@/utils/sharedHelper";
import toast from "react-hot-toast";

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
  scheduledSession: SessionItem | null;
  getSessionById: (sessionId: string) => SessionItem | undefined;

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
  const userId = useSelector((state: RootState) => state.auth.user?.publicId) || getTokensAndUserId().userId;

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
      const res = await getCaseSessions(caseId, { page: sessionsPage, pageSize: 100 });
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

  // ── Derived: scheduled session ──
  const scheduledSession = sessions.find(
    (s) => s.status?.toLowerCase() === "scheduled"
  ) || null;

  // ── Helper: find session by ID ──
  const getSessionById = useCallback(
    (sessionId: string) => sessions.find(
      (s) => s.id.toLowerCase() === sessionId.toLowerCase()
    ),
    [sessions]
  );

  const hasRequest = caseData?.userFlags?.hasRequest;

  // ── Fetch doctor requests ──
  const fetchDoctorRequests = useCallback(async () => {
    if (role !== "Doctor" || !hasRequest || !userId || !caseId) return;
    setDoctorRequestsLoading(true);
    try {
      const res = await getDoctorMyCaseRequests(userId, { page: 1, pageSize: 20, sortDirection: "desc" });
      if (res.success && res.data) {
        // Filter only requests for this specific case (case-insensitive UUID match)
        const filtered = res.data.items.filter(
          (r) => String(r.patientCasePublicId).toLowerCase() === String(caseId).toLowerCase()
        );
        setDoctorRequests(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch doctor requests:", err);
      toast.error("Failed to Find doctor requests");
    } finally {
      setDoctorRequestsLoading(false);
    }
  }, [role, userId, caseId, hasRequest]);

  const assignedDoctorId = caseData?.assignedDoctorId;
  const assignedStudentId = caseData?.assignedStudentId;
  const createdById = caseData?.createdById;
  const createdByRole = caseData?.createdByRole;

  // ── Fetch info owner case data ──
  const fetchInfoOwnerCaseData = useCallback(async () => {
    if (!userId || !role || !caseId) return;
    setInfoOwnerDataLoading(true);
    try {
        const AssignedDoctorData = assignedDoctorId ? await getDoctorById(assignedDoctorId) : null;
        setDoctorOwnerData(AssignedDoctorData);
        
        const AssignedStudentData = assignedStudentId ? await getStudentById(assignedStudentId) : null;
        setStudentOwnerData(AssignedStudentData);
        
        let CreatedUser: DoctorDataResponse | StudentDataResponse | null = null;
        if (createdById) {
            if (createdByRole === "Doctor") {
                CreatedUser = await getDoctorById(createdById);
            } else if (createdByRole === "Student") {
                CreatedUser = await getStudentById(createdById);
            }
        }
        setCreatorData(CreatedUser);

    } catch (err) {
      console.error("Failed to fetch user data:", err);
    } finally {
      setInfoOwnerDataLoading(false);
    }
  }, [userId, role, caseId, assignedDoctorId, assignedStudentId, createdById, createdByRole]);

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
        scheduledSession,
        getSessionById,
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