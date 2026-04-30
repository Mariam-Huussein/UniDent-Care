import { CaseTypeResponse } from "@/types/caseTypes";
import axiosInstance from "@/utils/api";
import axios, { AxiosRequestConfig } from "axios";

export async function getCaseTypes(page: number = 1, pageSize: number = 100, search?: string): Promise<CaseTypeResponse> {
    try {
        // const options: AxiosRequestConfig = {
        //     url: `https://dental-hup1.runasp.net/api/CaseTypes`,
        //     method: "GET",
        //     params: { page, pageSize, search },
        // };
        // const response = await axios.request(options);
        const response = await axiosInstance.get(`CaseTypes?page=${page}&pageSize=${pageSize}&search=${search}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch case types");
    }
}