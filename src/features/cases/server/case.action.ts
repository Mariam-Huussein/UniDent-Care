import {
    AvailableCasesResponse,
    CaseDetailResponse,
    CasesQueryParams,
    DoctorSearchResponse,
    StudentMyCasesQueryParams,
    StudentMyRequestsQueryParams,
} from "../types/caseCardProps.types";
import {
    StudentDashboardMyCasesQueryParams,
    StudentDashboardMyRequestsQueryParams,
    StudentDashboardMyCasesResponse,
    StudentDashboardMyRequestsResponse
} from "../types/studentDashboard.types";
import {
    PatientMyCasesQueryParams,
    MyPatientCasesResponse,
    DiagnosesResponse,
} from "../types/caseCardProps.types";
import { getTokensAndUserId } from "@/utils/sharedHelper";
import axiosInstance from "@/utils/api";

export async function getAvailableCases(params: CasesQueryParams): Promise<AvailableCasesResponse> {
    try {
        const response = await axiosInstance.get(`/Students/available-cases`, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to find available cases");
    }
}

export async function getCaseById(caseId: string): Promise<CaseDetailResponse> {
    try {
        const response = await axiosInstance.get(`/Cases/${caseId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch case details");
    }
}

export async function getDiagnosesByCaseId(caseId: string, page: number = 1, pageSize: number = 100): Promise<DiagnosesResponse> {
    try {
        const response = await axiosInstance.get(`/Diagnoses/case/${caseId}`, {
            params: { page, pageSize }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch diagnoses");
    }
}

export async function getStudentMyCases(params: StudentDashboardMyCasesQueryParams): Promise<StudentDashboardMyCasesResponse> {
    try {
        const response = await axiosInstance.get(`/Students/my-cases`, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch my cases");
    }
}

export async function getStudentMyRequests(params: StudentDashboardMyRequestsQueryParams): Promise<StudentDashboardMyRequestsResponse> {
    try {
        const response = await axiosInstance.get(`/Students/my-requests`, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch my requests");
    }
}

export async function getPatientMyCases(patientId: string, params: PatientMyCasesQueryParams): Promise<MyPatientCasesResponse> {
    try {
        const response = await axiosInstance.get(`/Cases/patient/${patientId}`, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch patient cases");
    }
}

export async function searchDoctorsByUsername(username: string, universityId: string): Promise<DoctorSearchResponse> {
    const { token: cookieToken } = getTokensAndUserId();
    try {
        const queryParams: Record<string, string> = {
            universityId: universityId,
        };

        if (username && username.trim() !== "") {
            queryParams.username = username;
        }

        const response = await axiosInstance.get(`/Doctors`, { params: queryParams });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to search doctors");
    }
}