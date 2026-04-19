import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import {
    ApproveRejectResponse,
    CancelRequestResponse,
    CaseRequestBody,
    CaseRequestResponse,
} from "../types/caseCardProps.types";

const cookieToken = Cookies.get("token");
const cookieUserId = Cookies.get("user_id");

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

export async function getCaseRequestById(requestId: string): Promise<CaseRequestResponse> {
    try {
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