import { ApiResponse } from "@/types/api";
import { UserFlags } from "./caseCardProps.types";
import { DiagnosisDto } from "@/services/PatientDashboardAnalytics";

export interface StudentDashboardCaseItem {
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    description?: string;
    status: string;
    processStatus: string;
    phone: string;
    city: string;
    nationalId: string;
    isPublic: boolean;
    universityId: string;
    universityName: string;
    createAt: string;
    totalSessions: number;
    hasEvaluatedSession: boolean;
    pendingRequests: number;
    assignedStudentId: string;
    assignedDoctorId: string;
    diagnoses: DiagnosisDto[];
    imageUrls: string[];
    createdById: string;
    createdByRole: string;
    userFlags: UserFlags;
    availableActions: string[];
}

export interface StudentDashboardMyCasesMetaData {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: StudentDashboardCaseItem[];
}

export type StudentDashboardMyCasesResponse = ApiResponse<StudentDashboardMyCasesMetaData>;

export interface StudentDashboardRequestItem {
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

export interface StudentDashboardMyRequestsMetaData {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: StudentDashboardRequestItem[];
}

export type StudentDashboardMyRequestsResponse = ApiResponse<StudentDashboardMyRequestsMetaData>;

export interface StudentDashboardMyCasesQueryParams {
    caseType?: string;
    page?: number;
    pageSize?: number;
}

export interface StudentDashboardMyRequestsQueryParams {
    status?: string;
    page?: number;
    pageSize?: number;
}
