import axiosInstance from "@/utils/api";
import { CasesQueryParams } from "../types/caseCardProps.types";

export const fetchCasesForClinicalDoctor = async (queryParams: CasesQueryParams) => {
    try {
        const response = await axiosInstance.get("/Cases", {
            params: queryParams,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching cases for ClinicalDoctor:", error);
        throw error;
    }
};