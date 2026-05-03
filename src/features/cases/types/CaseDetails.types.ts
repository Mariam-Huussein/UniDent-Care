import { DiagnosisDto } from "@/services/PatientDashboardAnalytics";
import { UserFlags } from "./caseCardProps.types";

export type CaseStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled' | 'UnderReview' | 'Rejected';

export type ToothStatus = 'healthy' | 'needs-treatment' | 'in-progress' | 'treated';
export type DiagnosisStage = 'BasicClinic' | 'AI' | '' | 0 | 1;

export interface ToothData {
    number: number;
    status: ToothStatus;
    treatmentType?: string;
    caseTypeId?: string;
    notes?: string;
}

export interface SessionInfo {
    date: string;
    time: string;
    description: string;
    isNext?: boolean;
}

export interface StudentAssignment {
    id: string;
    name: string;
    phone: string;
    email: string;
    university: string;
    level: number;
    avatarUrl?: string;
}

export interface PatientCase {
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    phone?: string;
    description: string | null;
    patientAvatar?: string;
    status: CaseStatus;
    processStatus: string;
    caseType: string;
    isPublic: boolean;
    city: string;
    nationalId: string;
    gender: string | null;
    universityId: string;
    universityName: string;
    medicalHistory?: string[];
    medications?: string[];
    imageUrls: string[];
    beforeImageUrls?: string[];
    afterImageUrls?: string[];
    student?: StudentAssignment;
    sessions: SessionInfo[];
    progressStep: string; // 0=diagnosis, 1=treatment, 2=follow-up
    treatmentSummary?: string;
    feedbackNotes?: string;
    createdAt: string;
    completedAt?: string;
    totalSessions: number;
    hasEvaluatedSession: boolean;
    pendingRequests: number;
    assignedStudentId: string | null;
    assignedDoctorId: string | null;
    diagnosisdto: DiagnosisDto[] | null;
    createdById: string;
    createdByRole: string;
    userFlags: UserFlags;
    availableActions: string[];
}
