import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { AvailableCasesResponse, CaseDetailResponse, CaseRequestBody, CaseRequestResponse } from "../types/caseCardProps.types";

export async function getAvailableCases(page: number, pageSize: number): Promise<AvailableCasesResponse> {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("Authentication required");
    }

    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/available-cases`,
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

export async function getCaseById(caseId: string): Promise<CaseDetailResponse> {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("Authentication required");
    }

    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Cases/${caseId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch case details");
    }
}

export async function sendCaseRequest(body: CaseRequestBody): Promise<CaseRequestResponse> {
    const token = Cookies.get("token");
    if (!token) {
        throw new Error("Authentication required");
    }

    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/CaseRequests`,
            method: "POST",
            data: body,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to send case request");
    }
}