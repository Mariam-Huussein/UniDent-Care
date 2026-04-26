import { ApiResponse } from "@/types/api";

export interface SessionItem {
    id: string;
    caseId: string;
    treatmentType: string;
    patientId: string;
    patientName: string;
    studentId: string;
    studentName: string;
    scheduledAt: string;
    endAt: string;
    status: string;
    totalNotes: number;
    totalMedia: number;
    createAt: string;
}

export interface SessionsMetaData {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: SessionItem[];
}

export type CaseSessionsResponse = ApiResponse<SessionsMetaData>;

export interface UpdateSessionStatusBody {
    sessionId: string;
    status: string;
}

export type UpdateSessionStatusResponse = ApiResponse<boolean>;

export interface DoctorRequestItem {
  id: string;
  patientCasePublicId: string;
  patientName: string;
  caseName: string;
  studentPublicId: string;
  studentName: string;
  university: string;
  level: number;
  doctorId: string;
  doctorName: string;
  description: string;
  status: string;
  createAt: string;
  isRejectedStudent: boolean;
}

export interface DoctorRequestsMetaData {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: DoctorRequestItem[];
}

export type DoctorRequestsResponse = ApiResponse<DoctorRequestsMetaData>;

export interface CreateSessionBody {
    studentId: string | undefined;
    patientCaseId: string | undefined;
    sessionDate: string;
    location: string;
}

export type CreateSessionResponse = ApiResponse<string>;

export interface SessionBookingData {
    date: Date;
    startTime: string; // "HH:MM:SS"
    endTime: string;   // "HH:MM:SS"
    location: string;
}

/* ═══ Session Notes ═══ */
export interface SessionNoteBody {
    sessionId: string;
    note: string;
    isPrivate: boolean;
    imageUrl?: string;
}

export type SessionNoteResponse = ApiResponse<string>;

/** Local representation of a note added during the session */
export interface SessionNoteItem {
    id: string;
    note: string;
    isPrivate: boolean;
    imageUrl?: string;
    createdAt: string;
}
