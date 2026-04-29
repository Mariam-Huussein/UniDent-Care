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
import axiosInstance from "@/utils/api";


export async function sendCaseRequest(body: CaseRequestBody): Promise<CaseRequestResponse> {
    try {
        const response = await axiosInstance.post(`/CaseRequests`, body);
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
        const { userId: cookieUserId } = await getTokensAndUserId();
        const response = await axiosInstance.delete(`/CaseRequests/${requestId}/${cookieUserId}`);
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
        const { userId: cookieUserId } = await getTokensAndUserId();

        const response = await axiosInstance.get(`/CaseRequests/requests/${cookieUserId}`);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        throw new Error(data?.message || "Failed to fetch request details");
    }
}

export async function getCaseRequestById(requestId: string): Promise<CaseRequestResponse> {
    try {
        const response = await axiosInstance.get(`/CaseRequests/${requestId}`);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        throw new Error(data?.message || "Failed to fetch request details");
    }
}

export async function approveRequest(requestId: string): Promise<ApproveRejectResponse> {
    try {
        const response = await axiosInstance.post(`/Doctors/requests/${requestId}/approve`);
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
        const response = await axiosInstance.post(`/Doctors/requests/${requestId}/reject`);
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
        const response = await axiosInstance.get(`/CaseRequests/case/${caseId}`);
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
        const response = await axiosInstance.get(`/Doctors/my-requests`)
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch doctor requests");
    }
}