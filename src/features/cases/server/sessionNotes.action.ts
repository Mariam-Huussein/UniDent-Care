import axios, { AxiosRequestConfig } from "axios";
import { SessionNoteBody, SessionNoteResponse } from "../types/Sessions.types";
import { getTokensAndUserId } from "@/utils/sharedHelper";

const BASE_URL = "https://dental-hup1.runasp.net/api/Sessions";

/**
 * POST /api/Sessions/{id}/notes
 * Adds a clinical note to a session.
 */
export async function addSessionNote(
    sessionId: string,
    body: SessionNoteBody
): Promise<SessionNoteResponse> {
    try {
        const { token: cookieToken } = await getTokensAndUserId();
        const options: AxiosRequestConfig = {
            url: `${BASE_URL}/${sessionId}/notes`,
            method: "POST",
            data: body,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
                "Content-Type": "application/json",
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
        throw new Error(data?.message || error.message || "Failed to add session note");
    }
}
