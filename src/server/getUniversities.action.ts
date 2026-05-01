import axiosInstance from "@/utils/api";

export interface UniversityLookup {
    id: string;
    name: string;
}

export interface UniversityLookupResponse {
    success: boolean;
    message: string;
    data: UniversityLookup[];
}

export async function getUniversitiesLookup(): Promise<UniversityLookupResponse> {
    try {
        const response = await axiosInstance.get(`/Universities/lookup`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch universities");
    }
}
