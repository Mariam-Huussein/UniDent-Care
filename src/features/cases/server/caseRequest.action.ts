import axios, { AxiosRequestConfig } from "axios";
import {
    ApproveRejectResponse,
    CancelRequestResponse,
    CaseRequestBody,
    CaseRequestResponse,
    CaseRequestData,
} from "../types/caseCardProps.types";
import { getTokensAndUserId } from "@/utils/sharedHelper";
import { ApiResponse } from "@/types/api";
import { DoctorRequestsResponse } from "../types/Sessions.types";


export async function sendCaseRequest(body: CaseRequestBody): Promise<CaseRequestResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
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
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message);
    }
}

export async function cancelCaseRequest(requestId: string): Promise<CancelRequestResponse> {
    try {
        const { token: cookieToken, userId: cookieUserId } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/CaseRequests/${requestId}/${cookieUserId}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || "Failed to cancel request");
    }
}

export async function getAllCaseRequestsForDoctor(): Promise<CaseRequestResponse> {
    try {
        const { token: cookieToken, userId: cookieUserId } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/CaseRequests/requests/${cookieUserId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        throw new Error(data?.message || "Failed to fetch request details");
    }
}

export async function getCaseRequestById(requestId: string): Promise<CaseRequestResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/CaseRequests/${requestId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        throw new Error(data?.message || "Failed to fetch request details");
    }
}

export async function approveRequest(requestId: string): Promise<ApproveRejectResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Doctors/requests/${requestId}/approve`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || "Failed to approve request");
    }
}

export async function rejectRequest(requestId: string): Promise<ApproveRejectResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Doctors/requests/${requestId}/reject`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || "Failed to reject request");
    }
}

export async function getCaseRequestsByCaseId(caseId: string): Promise<ApiResponse<CaseRequestData[]>> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/CaseRequests/case/${caseId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        throw new Error(data?.message || "Failed to fetch case requests");
    }
}


export async function getDoctorMyCaseRequests(
    doctorId: string,
    params: { status?: number; page?: number; pageSize?: number; sortDirection?: string } = { page: 1, pageSize: 20, sortDirection: "desc" }
): Promise<DoctorRequestsResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Doctors/my-requests`,
            method: "GET",
            params,
            headers: { Authorization: `Bearer ${cookieToken}` },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch doctor requests");
    }
}