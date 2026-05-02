import { CaseTypeResponse } from "@/types/caseTypes";
import axiosInstance from "@/utils/api";

export async function getCaseTypes(page: number = 1, pageSize: number = 100, search?: string): Promise<CaseTypeResponse> {
    try {
        const response = await axiosInstance.get(`CaseTypes`, {
            params: { page, pageSize, search: search || undefined }
        });
        console.log("Case Types", response.data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch case types");
    }
}