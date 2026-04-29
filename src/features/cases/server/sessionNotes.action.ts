import { SessionNoteBody, AddSessionNoteResponse, GetSessionNotesResponse } from "../types/Sessions.types";
import axiosInstance from "@/utils/api";

export async function addSessionNote(sessionId: string, body: SessionNoteBody): Promise<AddSessionNoteResponse> {
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