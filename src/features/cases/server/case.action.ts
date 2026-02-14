import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { AvailableCasesResponse } from "../types/caseCardProps.types";

export async function getAvailableCases(page: number, pageSize: number, studentId: string): Promise<AvailableCasesResponse> {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("Authentication required");
    }

    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/${studentId}/available-cases`,
            method: "GET",
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.request(options);
        console.log("response", response);
        return response.data;
    } catch (error: any) {
        console.log("error", error);
        throw new Error(error.response?.data?.message || "Failed to fetch available cases");
    }
}