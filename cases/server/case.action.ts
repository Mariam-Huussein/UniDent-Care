import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { AvailableCasesResponse, CaseDetailResponse, CaseRequestBody, CaseRequestResponse } from "../types/caseCardProps.types";
import { CaseTypeResponse } from "@/types/caseTypes";

const cookieToken = Cookies.get("token");

export async function getAvailableCases(page: number, pageSize: number, token: string, caseType?: string): Promise<AvailableCasesResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/available-cases`,
            method: "GET",
            params: { page, pageSize, caseType },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to find available cases");
    }
}

export async function getCaseById(caseId: string): Promise<CaseDetailResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Cases/${caseId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch case details");
    }
}

export async function sendCaseRequest(body: CaseRequestBody): Promise<CaseRequestResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/CaseRequests`,
            method: "POST",
            data: body,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message);
    }
}