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
    status: string | number;
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

/* ═══ Session Media ═══ */
export interface SessionMediaItem {
    id: string;
    sessionId: string;
    noteId: string | null;
    mediaUrl: string;
    createAt: string;
}

export type AddSessionMediaResponse = ApiResponse<SessionMediaItem>;
export type GetSessionMediaResponse = ApiResponse<SessionMediaItem[]>;

/* ═══ Session Notes ═══ */
export interface SessionNoteBody {
    sessionId: string;
    note: string;
}

/** Full note item as returned by the backend */
export interface SessionNoteItem {
    id: string;
    sessionId: string;
    note: string;
    createAt: string;
    medias: SessionMediaItem[];
}

export type AddSessionNoteResponse = ApiResponse<SessionNoteItem>;
export type GetSessionNotesResponse = ApiResponse<SessionNoteItem[]>;
export type AddNoteMediaResponse = ApiResponse<SessionMediaItem>;
export type GetNoteMediaResponse = ApiResponse<SessionMediaItem[]>;

/* ═══ Session Evaluation ═══ */
export interface EvaluateSessionBody {
    grade: number;
    note: string;
    isFinalSession: boolean;
}

export type EvaluateSessionResponse = ApiResponse<boolean>;

/** Extended session item that includes evaluation data returned by the timeline endpoint */
export interface TimelineSessionItem extends SessionItem {
    grade: number;
    doctorNote: string | "";
    evaluteDoctorId: string | null;
    evaluteDoctorName: string | null;
    updateAt: string;
    notes: SessionNoteItem[];
}
