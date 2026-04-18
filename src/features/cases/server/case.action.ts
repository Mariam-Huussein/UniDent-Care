import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import {
    AvailableCasesResponse,
    ApproveRejectResponse,
    CancelRequestResponse,
    CaseDetailResponse,
    CaseRequestBody,
    CaseRequestResponse,
    CasesQueryParams,
    CreateSessionBody,
    CreateSessionResponse,
    MyStudentCasesResponse,
    MyStudentRequestsResponse,
    StudentMyCasesQueryParams,
    StudentMyRequestsQueryParams,
    PatientMyCasesQueryParams,
    MyPatientCasesResponse,
} from "../types/caseCardProps.types";

const cookieToken = Cookies.get("token");

export async function getAvailableCases(params: CasesQueryParams, token: string): Promise<AvailableCasesResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/available-cases`,
            method: "GET",
            params,
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


export async function createSession(body: CreateSessionBody): Promise<CreateSessionResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Sessions`,
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
        throw new Error(data?.message || "Failed to create session");
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
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message);
    }
}

export async function cancelCaseRequest(requestId: string, studentId: string): Promise<CancelRequestResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/CaseRequests/${requestId}/${studentId}`,
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

export async function getStudentMyCases(params: StudentMyCasesQueryParams): Promise<MyStudentCasesResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/my-cases`,
            method: "GET",
            params,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch my cases");
    }
}

export async function getStudentMyRequests(params: StudentMyRequestsQueryParams): Promise<MyStudentRequestsResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/my-requests`,
            method: "GET",
            params,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch my requests");
    }
}

export async function getPatientMyCases(patientId: string, params: PatientMyCasesQueryParams): Promise<MyPatientCasesResponse> {
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Cases/patient/${patientId}`,
            method: "GET",
            params,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch patient cases");
    }
}