"use server";

import axiosInstance from "@/utils/api";

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
    try {
        const response = await axiosInstance.post(`/Diagnoses`, payload);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Submit Diagnoses Error:", error.response?.data || error.message);
        return { 
            success: false, 
            message: error.response?.data?.message || "Failed to submit diagnosis plan." 
        };
    }
}
