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

export interface UpdateDoctorPayload {
    publicId: string;
    name: string;
    specialty: string;
    universityId: string;
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
}

export interface PaginatedRequests {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: CaseRequest[];
}

export const doctorDashboardService = {
    getDoctorDetails: async (id: string): Promise<DoctorStats> => {
        const response = await api.get(`/Doctors/${id}`);
        return response.data.data;
    },
    getDoctorRequests: async (page: number = 1, pageSize: number = 10, status?: number, sortDirection: string = "desc"): Promise<PaginatedRequests> => {
        const params: any = { page, pageSize, sortDirection };
        if (status !== undefined) {
            params.status = status;
        }
        const response = await api.get(`/Doctors/my-requests`, { params });
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
        const response = await api.get(`/CaseRequests/doctor/${doctorId}`, { params: { page, pageSize } });
        return response.data.data;
    },
    getCaseRequestById: async (id: string): Promise<CaseRequest> => {
        const response = await api.get(`/CaseRequests/${id}`);
        return response.data.data;
    },
    updateDoctorProfile: async (id: string, payload: UpdateDoctorPayload): Promise<boolean> => {
        const response = await api.put(`/Doctors/${id}`, payload);
        return response.data.success;
    },
};
