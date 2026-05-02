import {
    SessionNoteBody,
    AddSessionNoteResponse,
    GetSessionNotesResponse,
    AddNoteMediaResponse,
    GetNoteMediaResponse,
    AddSessionMediaResponse,
    GetSessionMediaResponse,
} from "../../session/types/Sessions.types";
import axiosInstance from "@/utils/api";

/* ═══ Notes ═══ */

export async function addSessionNote(
    sessionId: string,
    body: SessionNoteBody
): Promise<AddSessionNoteResponse> {
    try {
        const response = await axiosInstance.post(`/Sessions/${sessionId}/notes`, body);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || error.message || "Failed to add session note");
    }
}

export async function getSessionNotes(sessionId: string): Promise<GetSessionNotesResponse> {
    try {
        const response = await axiosInstance.get(`/Sessions/${sessionId}/notes`);
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || error.message || "Failed to get session notes");
    }
}

/* ═══ Note Media ═══ */

export async function addNoteMedia(
    sessionId: string,
    noteId: string,
    file: File
): Promise<AddNoteMediaResponse> {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axiosInstance.post(
            `/Sessions/${sessionId}/notes/${noteId}/media`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || error.message || "Failed to upload note media");
    }
}

export async function getNoteMedia(
    sessionId: string,
    noteId: string
): Promise<GetNoteMediaResponse> {
    try {
        const response = await axiosInstance.get(`/Sessions/${sessionId}/notes/${noteId}/media`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to get note media");
    }
}

/* ═══ Session-level Media ═══ */

export async function addSessionMedia(
    sessionId: string,
    file: File
): Promise<AddSessionMediaResponse> {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axiosInstance.post(
            `/Sessions/${sessionId}/media`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error: any) {
        const data = error.response?.data;
        const validationErrors = data?.error?.errors;
        if (validationErrors?.length) {
            throw new Error(validationErrors.join(", "));
        }
        throw new Error(data?.message || error.message || "Failed to upload session media");
    }
}

export async function getSessionMedia(sessionId: string): Promise<GetSessionMediaResponse> {
    try {
        const response = await axiosInstance.get(`/Sessions/${sessionId}/media`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to get session media");
    }
}