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
    /** 0=All 1=Pending 2=Approved 3=Rejected 4=? 5=? */
    status?: number;
    sortDirection?: "asc" | "desc";
    /** client-side search query (filtered locally since API doesn't support text search) */
    search?: string;
}

export const doctorDashboardService = {
    getDoctorDetails: async (id: string): Promise<DoctorStats> => {
        const response = await api.get(`/Doctors/${id}`);
        return response.data.data;
    },

    /** Primary endpoint for doctor requests – supports status filter & sort */
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

    getCaseRequestsByDoctor: async (doctorId: string, page: number = 1, pageSize: number = 10): Promise<PaginatedRequests> => {
        const response = await api.get(`/CaseRequests/doctor/${doctorId}`, { params: { page, pageSize, sort: "desc" } });
        return response.data.data;
    },

    getCaseRequestById: async (id: string): Promise<CaseRequest> => {
        const response = await api.get(`/CaseRequests/${id}`);
        return response.data.data;
    },

    getUniversitiesLookup: async (): Promise<UniversityLookup[]> => {
        const response = await api.get(`/Universities/lookup`);
        return response.data.data;
    },

    getDoctorCases: async (doctorId: string, params: { page?: number; pageSize?: number; status?: string; search?: string; caseType?: string } = {}) => {
        const { page = 1, pageSize = 10, status, search, caseType } = params;
        const query: Record<string, any> = { page, pageSize };
        if (status) query.status = status;
        if (search) query.PatientName = search; // التغيير هنا ليتوافق مع الـ Backend
        if (caseType) query.CaseType = caseType; // التغيير هنا ليتوافق مع الـ Backend
        const response = await api.get(`/Cases/doctor/${doctorId}`, { params: query });
        return response.data;
    },
};
