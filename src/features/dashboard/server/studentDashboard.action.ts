import { ApiResponse } from "@/types/api";
import axiosInstance from "@/utils/api";

export interface Media {
    id: string;
    sessionId: string;
    noteId: string;
    mediaUrl: string;
    createAt: string;
}

export interface Note {
    id: string;
    sessionId: string;
    note: string;
    createAt: string;
    medias: Media[];
}

export interface SessionItem {
    id: string;
    caseId: string;
    treatmentType: string;
    patientId: string;
    patientName: string;
    studentId: string;
    studentName: string;
    grade?: number;
    doctorNote?: string;
    evaluteDoctorId?: string;
    evaluteDoctorName?: string;
    assignedDoctorId?: string;
    assignedDoctorName?: string;
    scheduledAt: string;
    endAt: string;
    status: string;
    totalNotes: number;
    totalMedia: number;
    createAt: string;
    updateAt?: string;
    notes?: Note[];
}

export interface SessionsResponse extends ApiResponse<{
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: SessionItem[];
}> {}


export async function getStudentSessions(studentId: string, page: number = 1, pageSize: number = 100): Promise<SessionItem[]> {
    try {
        const response = await axiosInstance.get<SessionsResponse>(`/Sessions/student/${studentId}`, {
            params: { page, pageSize }
        });
        if (response.data.success) {
            return response.data.data.items;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch student sessions:", error);
        return [];
    }
}

export async function getUpcomingSessions(studentId: string, page: number = 1, pageSize: number = 5): Promise<SessionItem[]> {
    try {
        const response = await axiosInstance.get<SessionsResponse>('/Sessions/schedule/upcoming', {
            params: { studentId, page, pageSize }
        });
        if (response.data.success) {
            return response.data.data.items;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch upcoming sessions:", error);
        return [];
    }
}