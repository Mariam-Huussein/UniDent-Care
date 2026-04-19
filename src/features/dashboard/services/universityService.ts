import api from "@/utils/api";

export interface UniversityLookup {
    id: string;
    name: string;
}

export const universityService = {
    getUniversitiesLookup: async (): Promise<UniversityLookup[]> => {
        const response = await api.get("/Universities/lookup");
        return response.data.data;
    }
};
