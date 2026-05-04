import api from "@/utils/api";

export interface DoctorStats {
    publicId: string;
    fullName: string;
    email: string;
    specialty: string;
    universityId: string;
    createAt: string;
    totalStudents: number;
    pendingRequests: number;
    approvedRequests: number;
}

export interface CaseRequest {
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
    isRejectedStudent?: boolean;
}

export interface UniversityLookup {
    id: string;
    name: string;
}

export interface PaginatedRequests {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: CaseRequest[];
}

export interface MyRequestsParams {
    page?: number;
    pageSize?: number;
    /** 0=All 1=Pending 2=Approved 3=Rejected */
    status?: number;
    sortDirection?: "asc" | "desc";
    search?: string;
}

// ──────────────────────────────────────────────
// Session types — based on SessionDto in swagger.json
// ──────────────────────────────────────────────
export interface SessionNoteDto {
    id: string;
    content: string | null;
    createdAt: string;
    studentName?: string | null;
}

export interface SessionDto {
    id: string;
    caseId: string;
    treatmentType: string | null;
    patientId: string;
    patientName: string | null;
    studentId: string;
    studentName: string | null;
    grade: number;
    doctorNote: string | null;
    evaluteDoctorId: string | null;
    evaluteDoctorName: string | null;
    assignedDoctorId: string | null;
    assignedDoctorName: string | null;
    scheduledAt: string;
    endAt: string;
    status: string | null;
    totalNotes: number;
    totalMedia: number;
    createAt: string;
    updateAt: string | null;
    notes: SessionNoteDto[] | null;
}

export interface SessionPagedResult {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: SessionDto[];
}

export const doctorDashboardService = {
    getDoctorDetails: async (id: string): Promise<DoctorStats> => {
        const response = await api.get(`/Doctors/${id}`);
        return response.data.data;
    },

    /** GET /api/Doctors/my-requests — supports status filter & sort */
    getDoctorRequests: async (params: MyRequestsParams = {}): Promise<PaginatedRequests> => {
        const { page = 1, pageSize = 10, status, sortDirection = "desc" } = params;
        const query: Record<string, any> = { page, pageSize, sortDirection };
        if (status !== undefined) query.status = status;
        const response = await api.get(`/Doctors/my-requests`, { params: query });
        return response.data.data;
    },

    approveRequest: async (requestId: string): Promise<boolean> => {
        const response = await api.post(`/Doctors/requests/${requestId}/approve`);
        return response.data.data;
    },

    rejectRequest: async (requestId: string): Promise<boolean> => {
        const response = await api.post(`/Doctors/requests/${requestId}/reject`);
        return response.data.data;
    },

    getCaseRequestsByDoctor: async (
        doctorId: string,
        params: { page?: number; pageSize?: number; search?: string; caseType?: string; status?: number } = {}
    ) => {
        const { page = 1, pageSize = 10, search, caseType, status } = params;
        const query: Record<string, any> = { page, pageSize, sort: "desc" };
        if (search) query.PatientName = search;
        if (caseType) query.CaseType = caseType;
        if (status !== undefined) query.status = status;
        const response = await api.get(`/CaseRequests/doctor/${doctorId}`, { params: query });
        return response.data;
    },

    getCaseRequestById: async (id: string): Promise<CaseRequest> => {
        const response = await api.get(`/CaseRequests/${id}`);
        return response.data.data;
    },

    getUniversitiesLookup: async (): Promise<UniversityLookup[]> => {
        const response = await api.get(`/Universities/lookup`);
        return response.data.data;
    },

    /** GET /api/Cases/doctor/{docId} */
    getDoctorCases: async (
        doctorId: string,
        params: { page?: number; pageSize?: number; status?: string; search?: string; caseType?: string } = {}
    ) => {
        const { page = 1, pageSize = 10, status, search, caseType } = params;
        const query: Record<string, any> = { page, pageSize };
        if (status) query.status = status;
        if (search) query.PatientName = search;
        if (caseType) query.CaseType = caseType;
        const response = await api.get(`/Cases/doctor/${doctorId}`, { params: query });
        return response.data;
    },

    // ──────────────────────────────────────────────
    // Calendar Dashboard — new methods
    // ──────────────────────────────────────────────

    /** GET /api/Sessions/schedule — all sessions, optional status filter */
    getScheduleSessions: async (params: { page?: number; pageSize?: number; status?: string } = {}): Promise<SessionPagedResult> => {
        const { page = 1, pageSize = 200, status } = params;
        const query: Record<string, any> = { page, pageSize };
        if (status) query.status = status;
        const response = await api.get(`/Sessions/schedule`, { params: query });
        return response.data.data;
    },

    /** GET /api/Doctors/sessions-to-evaluate — sessions needing evaluation */
    getSessionsToEvaluate: async (params: { page?: number; pageSize?: number } = {}): Promise<SessionPagedResult> => {
        const { page = 1, pageSize = 200 } = params;
        const response = await api.get(`/Doctors/sessions-to-evaluate`, { params: { page, pageSize } });
        return response.data.data;
    },
};
