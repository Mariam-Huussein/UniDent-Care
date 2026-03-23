export type CaseStatus = 'unassigned' | 'diagnosis' | 'in-progress' | 'completed';

export type ToothStatus = 'healthy' | 'needs-treatment' | 'in-progress' | 'treated';

export interface ToothData {
    number: number;
    status: ToothStatus;
    treatmentType?: string;
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
    patientName: string;
    patientAge: number;
    patientPhone?: string;
    patientCity?: string;
    description?: string;
    patientAvatar?: string;
    status: CaseStatus;
    caseType: string;
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
}
