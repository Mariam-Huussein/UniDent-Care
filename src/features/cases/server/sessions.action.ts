import axios, { AxiosRequestConfig } from "axios";
import { CaseSessionsResponse, CreateSessionBody, CreateSessionResponse, DoctorRequestsResponse, UpdateSessionStatusBody, UpdateSessionStatusResponse } from "../types/Sessions.types";
import { getTokensAndUserId } from "@/utils/sharedHelper";

export async function createSession(body: CreateSessionBody): Promise<CreateSessionResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Sessions`,
            method: "POST",
            data: body,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        if (response.status === 204 || response.status === 201 || response.status === 200) {
            if (response.status === 204 || !response.data) {
                return { success: true, message: "Session created successfully" } as CreateSessionResponse;
            }
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || error.message || "Failed to create session");
    }
}

export async function getSessionsByCase(
    caseId: string,
    page: number = 1,
    pageSize: number = 10
): Promise<CaseSessionsResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Sessions/case/${caseId}`,
            method: "GET",
            params: { page, pageSize },
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch sessions");
    }
}

export async function updateSessionStatus(
    sessionId: string,
    body: UpdateSessionStatusBody
): Promise<UpdateSessionStatusResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Sessions/${sessionId}/status`,
            method: "PATCH",
            data: body,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || "Failed to update session status");
    }
}

export async function getCaseSessions(
    caseId: string,
    params?: { page?: number; pageSize?: number }
): Promise<CaseSessionsResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Sessions/case/${caseId}`,
            method: "GET",
            params,
            headers: { Authorization: `Bearer ${cookieToken}` },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch sessions");
    }
}