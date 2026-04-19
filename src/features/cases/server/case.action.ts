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
    DoctorSearchResponse,
    MyStudentCasesResponse,
    MyStudentRequestsResponse,
    StudentMyCasesQueryParams,
    StudentMyRequestsQueryParams,
} from "../types/caseCardProps.types";

const cookieToken = Cookies.get("token");
const cookieUserId = Cookies.get("user_id");

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

export async function searchDoctorsByUsername(username: string, universityId: string): Promise<DoctorSearchResponse> {
    try {
        const queryParams: Record<string, string> = {
            universityId: universityId,
        };

        if (username && username.trim() !== "") {
            queryParams.username = username;
        }

        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Doctors`,
            method: "GET",
            params: queryParams,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to search doctors");
    }
}