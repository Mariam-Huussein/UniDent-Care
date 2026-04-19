import api from "@/utils/api";
import { CaseRequest, PaginatedRequests } from "./doctorDashboardService";

export const studentDashboardService = {
    getCaseRequests: async (
        studentId: string,
        page: number = 1,
        pageSize: number = 10,
        status?: number
    ): Promise<PaginatedRequests> => {
        const params: any = { page, pageSize };
        if (status !== undefined) {
            params.status = status;
        }
        const response = await api.get(`/CaseRequests/student/${studentId}`, { params });
        return response.data.data;
    },
};
