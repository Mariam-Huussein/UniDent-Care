import axiosInstance from "@/utils/api";

// --- Types ---
export interface CreateDiagnosisPayload {
    patientCaseId: string;
    stage: number;
    caseTypeId: string;
    notes: string;
    createdById: string;
    role: string;
    teethNumbers: number[];
}

export interface UpdateDiagnosisPayload {
    id: string;
    stage: number;
    caseTypeId: string;
    notes: string;
    teethNumbers: number[];
}

// --- Actions ---
export const submitDiagnoses = async (payload: CreateDiagnosisPayload) => {
    try {
        console.log("payload", payload)
        const response = await axiosInstance.post("/Diagnoses", payload);
        console.log("res", response)
        return response.data;
    } catch (error) {
        console.error("Error submitting diagnosis:", error);
        throw error;
    }
};

export const updateDiagnosis = async (payload: UpdateDiagnosisPayload) => {
    try {
        const response = await axiosInstance.put(`/Diagnoses/${payload.id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Error updating diagnosis:", error);
        throw error;
    }
};

export const deleteDiagnosis = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/Diagnoses/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting diagnosis:", error);
        throw error;
    }
};

export const acceptDiagnosis = async (id: string) => {
    try {
        const response = await axiosInstance.post(`/Diagnoses/${id}/accept`);
        return response.data;
    } catch (error) {
        console.error("Error accepting diagnosis:", error);
        throw error;
    }
};

export const getDiagnoses = async (caseId: string) => {
    try {
        const response = await axiosInstance.get("/Diagnoses", {
            params: { patientCaseId: caseId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching diagnoses:", error);
        throw error;
    }
};