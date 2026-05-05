import { ApiResponse } from "@/types/api";
import { CaseSessionsResponse, CreateSessionBody, CreateSessionResponse, DoctorRequestsResponse, EvaluateSessionBody, EvaluateSessionResponse, UpdateSessionStatusBody, UpdateSessionStatusResponse } from "../../session/types/Sessions.types";
import axiosInstance from "@/utils/api";

export async function createSession(body: CreateSessionBody): Promise<CreateSessionResponse> {
    try {
        const response = await axiosInstance.post("/Sessions", body);
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
        const response = await axiosInstance.get(`/Sessions/case/${caseId}`, { params: { page, pageSize } });
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
        const response = await axiosInstance.patch(`/Sessions/${sessionId}/status`, body);

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

export async function rescheduleSession(sessionId: string, studentId: string, newDate: string): Promise<UpdateSessionStatusBody> {
    try {
        const response = await axiosInstance.patch(`/Sessions/${sessionId}/schedule`, {
            sessionId: sessionId,
            studentId: studentId,
            newScheduledAt: newDate,
        });

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
        const response = await axiosInstance.get(`/Sessions/case/${caseId}`, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch sessions");
    }
}

export async function cancelSession(sessionId: string): Promise<ApiResponse<boolean>> {
    try {
        const response = await axiosInstance.delete(`/Sessions/${sessionId}`);
        if (response.status === 204 || response.status === 200) {
            return { success: true, message: "Session cancelled successfully" } as ApiResponse<boolean>;
        }
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || error.message || "Failed to cancel session");
    }
}

export async function evaluateSession(
    sessionId: string,
    body: EvaluateSessionBody
): Promise<EvaluateSessionResponse> {
    try {
        const response = await axiosInstance.post(`/Sessions/${sessionId}/evaluate`, body);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || error.message || "Failed to evaluate session");
    }
}