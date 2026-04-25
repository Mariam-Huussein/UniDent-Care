import axios, { AxiosRequestConfig } from "axios";
import {
    AvailableCasesResponse,
    CaseDetailResponse,
    CasesQueryParams,
    DoctorSearchResponse,
    MyStudentCasesResponse,
    MyStudentRequestsResponse,
    StudentMyCasesQueryParams,
    StudentMyRequestsQueryParams,
    PatientMyCasesQueryParams,
    MyPatientCasesResponse,
} from "../types/caseCardProps.types";
import { getTokens } from "@/utils/sharedHelper";

export async function getAvailableCases(params: CasesQueryParams): Promise<AvailableCasesResponse> {
    const { cookieToken } = getTokens();
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Students/available-cases`,
            method: "GET",
            params,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
            },
        };
        const response = await axios.request(options);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to find available cases");
    }
}

export async function getCaseById(caseId: string): Promise<CaseDetailResponse> {
    const { cookieToken } = getTokens();
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


export async function getStudentMyCases(params: StudentMyCasesQueryParams): Promise<MyStudentCasesResponse> {
    const { cookieToken } = getTokens();
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
    const { cookieToken } = getTokens();
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
    const { cookieToken } = getTokens();
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

export async function searchDoctorsByUsername(username: string, universityId: string): Promise<DoctorSearchResponse> {
    const { cookieToken } = getTokens();
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