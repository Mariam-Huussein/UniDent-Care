"use server";

import axios, { AxiosRequestConfig } from "axios";
import { getTokensAndUserId } from "@/utils/sharedHelper";

export interface CreateDiagnosisPayload {
    patientCaseId: string;
    stage: number;
    caseTypeId: string;
    notes: string;
    createdById: string;
    role: string;
    teethNumbers: number[];
}

export async function submitDiagnoses(payload: CreateDiagnosisPayload) {
    const { token: cookieToken } = await getTokensAndUserId();
    try {
        const options: AxiosRequestConfig = {
            url: `https://dental-hup1.runasp.net/api/Diagnoses`,
            method: "POST",
            data: payload,
            headers: {
                Authorization: `Bearer ${cookieToken}`,
                "Content-Type": "application/json",
            },
        };
        const response = await axios.request(options);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Submit Diagnoses Error:", error.response?.data || error.message);
        return { 
            success: false, 
            message: error.response?.data?.message || "Failed to submit diagnosis plan." 
        };
    }
}
