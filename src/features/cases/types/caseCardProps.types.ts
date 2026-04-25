import { ApiResponse } from "@/types/api";

export interface CaseCardProps {
    caseItem: CaseItem;
    hideRequestButton?: boolean;
    customBadge?: React.ReactNode;
    navigationPath?: string;
}

export interface CaseItem {
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    caseType: CaseType | null;
    status: string;
    createAt: string;
    gender: 0 | 1 | undefined;
    diagnosisdto: DiagnosisDto[] | null;
    imageUrls: string[];
    totalSessions?: number;
    pendingRequests?: number;
}

export interface CaseType {
    publicId: string;
    name: string;
    description: string;
}

export interface MetaData {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    items: CaseItem[];
    totalCount: number;
    totalPages: number;
}

export interface CasesQueryParams {
    PatientName?: string;
    CaseType?: string;
    Status?: string;
    Gender?: 0 | 1;
    SortBy?: string;
    SortDirection?: string;
    Page?: number;
    PageSize?: number;
}

export type Cases = CaseCardProps["caseItem"][];

export interface AvailableCasesResponse extends ApiResponse<MetaData> { }


export interface DiagnosisDto {
    id: string;
    diagnosisStage: string;
    caseType: string;
    notes: string;
    teethNumbers: number[];
}

export interface UserFlags {
    isOwner: boolean;
    role: string;
    isAssignedDoctor: boolean;
    isAssignedStudent: boolean;
    isAssignedToMe: boolean;
    hasRequest: boolean;
    requestId: string;
    requestStatus: string;
}

export interface CaseDetailData {
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    status: string;
    processStatus: string;
    phone: string;
    city: string;
    nationalId: string;
    gender: string | null;
    isPublic: boolean;
    universityId: string;
    universityName: string;
    createAt: string;
    totalSessions: number;
    hasEvaluatedSession: boolean;
    pendingRequests: number;
    assignedStudentId: string;
    assignedDoctorId: string;
    diagnosisdto: DiagnosisDto | null;
    imageUrls: string[];
    createdById: string;
    createdByRole: string;
    userFlags: UserFlags;
    availableActions: string[];
}

export interface CaseDetailResponse extends ApiResponse<CaseDetailData> { }

export interface CaseRequestBody {
    patientCasePublicId: string;
    studentPublicId: string;
    doctorUsername: string;
    description: string;
}

export interface CaseRequestData {
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
}

export type CaseRequestResponse = ApiResponse<CaseRequestData>;

export type CancelRequestResponse = ApiResponse<string>;

/* ═══ Doctor: Approve / Reject Request ═══ */
export type ApproveRejectResponse = ApiResponse<boolean>;


/* ═══ Doctor Search ═══ */
export interface DoctorSearchResult {
    publicId: string;
    username: string;
    fullName: string;
    specialty?: string;
}

export interface DoctorSearchMetaData {
    items: DoctorSearchResult[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export type DoctorSearchResponse = ApiResponse<DoctorSearchMetaData>;

/* ═══ Student: My Cases & My Requests ═══ */
export interface StudentMyCasesQueryParams {
    caseType?: string;
    page?: number;
    pageSize?: number;
}

export interface StudentMyRequestsQueryParams {
    status?: string;
    page?: number;
    pageSize?: number;
}

export interface StudentCaseItem {
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    status: string;
    processStatus: string;
    isPublic: boolean;
    universityId: string;
    universityName: string;
    createAt: string;
    totalSessions: number;
    hasEvaluatedSession: boolean;
    pendingRequests: number;
    assignedStudentId: string;
    assignedDoctorId: string;
    diagnosisdto: DiagnosisDto | null;
    imageUrls: string[];
    createdById: string;
    createdByRole: string;
    userFlags: UserFlags;
    availableActions: string[];
}

export interface StudentMyCasesMetaData {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: StudentCaseItem[];
}

export interface StudentRequestItem {
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
}

export interface StudentMyRequestsMetaData {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: StudentRequestItem[];
}

export type MyStudentCasesResponse = ApiResponse<StudentMyCasesMetaData>;
export type MyStudentRequestsResponse = ApiResponse<StudentMyRequestsMetaData>;

/* ═══ Patient: My Cases ═══ */
export interface PatientMyCasesQueryParams {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}

export interface PatientCaseItem extends StudentCaseItem { }

export interface PatientMyCasesMetaData {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: PatientCaseItem[];
}

export type MyPatientCasesResponse = ApiResponse<PatientMyCasesMetaData>;

