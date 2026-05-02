import api from "@/utils/api";

export const createCase = (data: {
    PatientId: string;
    Title: string;
    Description: string;
    CaseTypeId: string;
    Images?: File[];
}) => {
    const formData = new FormData();
    formData.append("PatientId", data.PatientId);
    formData.append("Title", data.Title);
    formData.append("Description", data.Description);
    formData.append("CaseTypeId", data.CaseTypeId);

    if (data.Images && data.Images.length > 0) {
        data.Images.forEach((image) => {
            formData.append("Images", image);
        });
    }

    return api.post("/Cases", formData);
};

export const createCaseAi = (data: {
    PatientId: string;
    Title: string;
    Description: string;
    CaseTypeId: string;
    IsPublic?: boolean;
    UniversityId?: string;
    CreatedById: string;
    CreatedByRole: string;
    Images?: File[];
}) => {
    const formData = new FormData();
    formData.append("PatientId", data.PatientId);
    formData.append("Title", data.Title);
    formData.append("Description", data.Description);
    formData.append("CaseTypeId", data.CaseTypeId);
    formData.append("CreatedById", data.CreatedById);
    formData.append("CreatedByRole", data.CreatedByRole);

    if (data.IsPublic !== undefined) {
        formData.append("IsPublic", data.IsPublic.toString());
    }
    if (data.UniversityId) {
        formData.append("UniversityId", data.UniversityId);
    }

    if (data.Images && data.Images.length > 0) {
        data.Images.forEach((image) => {
            formData.append("Images", image);
        });
    }

    return api.post("/Cases/ai/create", formData, {
        headers: {
            "X-AI-API-KEY": "this_key_for_ai_created_by_omargamal",
        },
    });
};

export const createDiagnosisAi = (data: {
    patientCaseId: string;
    stage: number;
    caseTypeId: string;
    notes?: string;
    createdById?: string;
    role?: string;
    teethNumbers?: number[];
}) => {
    return api.post("/Diagnoses/ai/create", data, {
        headers: {
            "X-AI-API-KEY": "this_key_for_ai_created_by_omargamal",
        },
    });
};