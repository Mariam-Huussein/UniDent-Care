import { DiagnosisDto, UserFlags } from "./caseCardProps.types";

export type CaseStatus = 'Pending' | 'InProgress' | 'Completed' | 'Cancelled' | 'UnderReview' | 'Rejected' | 'Diagnosis' ;

export type ToothStatus = 'healthy' | 'needs-treatment' | 'in-progress' | 'treated';
export type DiagnosisStage = 'BasicClinic' | 'AI' | '';

export interface ToothData {
    number: number;
    status: ToothStatus;
    treatmentType?: string;
    caseTypeId?: string;
    notes?: string;
}

export interface TimelineEvent {
    id: string;
    timestamp: string;
    description: string;
    type: 'info' | 'treatment' | 'diagnosis' | 'note';
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
    description?: string;
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
    teeth: ToothData[];
    timeline: TimelineEvent[];
    sessions: SessionInfo[];
    progressStep: number; // 0=diagnosis, 1=treatment, 2=follow-up
    treatmentSummary?: string;
    feedbackNotes?: string;
    createdAt: string;
    completedAt?: string;
    totalSessions: number;
    hasEvaluatedSession: boolean;
    pendingRequests: number;
    assignedStudentId: string | null;
    assignedDoctorId: string | null;
    diagnosisdto: DiagnosisDto | null;
    createdById: string;
    createdByRole: string;
    userFlags: UserFlags;
    availableActions: string[];
}
