import api from "@/utils/api";

/**
 * New Case API format matching POST /api/v2/Cases
 */
export interface CreateCaseApiDto {
  NationalId: string;
  Description: string;
  IsPublic?: boolean;
  UniversityId: string;
  Images?: File[];
  InitialDiagnosis?: {
    Stage: number;
    CaseTypeId: string;
    Notes?: string;
    TeethNumbers?: number[];
  };
  CreatedById: string;
  CreatedByRole: string;
}

/**
 * Old format - kept for backwards compatibility
 */
export interface CreateCaseFormDto {
  PatientId: string;
  Title: string;
  Description: string;
  CaseTypeId: string;
  Images?: File[];
}

/**
 * Create case with new API format
 * POST /api/v2/Cases
 */
export const createCase = (data: CreateCaseApiDto) => {
  const formData = new FormData();
  
  // Add all required fields
  formData.append("NationalId", data.NationalId);
  formData.append("Description", data.Description);
  formData.append("UniversityId", data.UniversityId);
  formData.append("CreatedById", data.CreatedById);
  formData.append("CreatedByRole", data.CreatedByRole);
  
  // Add optional fields
  if (data.IsPublic !== undefined) {
    formData.append("IsPublic", data.IsPublic.toString());
  }
  
  // Add images if provided
  if (data.Images && data.Images.length > 0) {
    data.Images.forEach((image) => {
      formData.append("Images", image);
    });
  }
  
  // Add initial diagnosis if provided
  if (data.InitialDiagnosis) {
    formData.append("InitialDiagnosis.Stage", data.InitialDiagnosis.Stage.toString());
    formData.append("InitialDiagnosis.CaseTypeId", data.InitialDiagnosis.CaseTypeId);
    
    if (data.InitialDiagnosis.Notes) {
      formData.append("InitialDiagnosis.Notes", data.InitialDiagnosis.Notes);
    }
    
    if (data.InitialDiagnosis.TeethNumbers && data.InitialDiagnosis.TeethNumbers.length > 0) {
      data.InitialDiagnosis.TeethNumbers.forEach((tooth, idx) => {
        formData.append(`InitialDiagnosis.TeethNumbers[${idx}]`, tooth.toString());
      });
    }
  }

  return api.post("/Cases", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Legacy format - for old AddCaseScreen
 */
export const createCaseLegacy = (data: CreateCaseFormDto) => {
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