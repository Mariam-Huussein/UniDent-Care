import api from "@/utils/api";
import { ApiResponse } from "@/types/api";

export interface CreateDiagnosisDto {
  patientCaseId: string;
  stage: number; // 0: Initial, 1: Final, etc.
  caseTypeId: string;
  notes?: string;
  createdById?: string;
  teethNumbers?: number[];
  role?: string;
}

export interface UpdateDiagnosisDto extends CreateDiagnosisDto {
  id: string;
}

export interface DiagnosisResponse {
  id: string;
  patientCaseId: string;
  stage: number;
  caseTypeId: string;
  caseTypeName: string;
  notes: string;
  createdById: string;
  role: string;
  isAccepted: boolean;
  teethNumbers: number[];
}

export interface PatientDiagnosesResponse {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: DiagnosisResponse[];
}

// ─────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────

export const createDiagnosis = (data: CreateDiagnosisDto) => {
  return api.post("/Diagnoses", data);
};

export const createAIDiagnosis = (data: CreateDiagnosisDto) => {
  return api.post("/Diagnoses/ai/create", data, {
    headers: {
      "X-AI-API-KEY": "this_key_for_ai_created_by_omargamal",
    },
  });
};

// ─────────────────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────────────────

/**
 * Get all diagnoses for a patient by their National ID
 * GET /api/v2/Diagnoses/patient/{nationalId}
 */
export const getPatientDiagnoses = async (
  nationalId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<PatientDiagnosesResponse>> => {
  const response = await api.get(
    `/Diagnoses/patient/${nationalId}`,
    {
      params: {
        page,
        pageSize,
      },
    }
  );
  return response.data;
};

/**
 * Get diagnoses for a specific case
 * GET /api/v2/Diagnoses/case/{caseId}
 */
export const getCaseDiagnoses = async (
  caseId: string,
  page: number = 1,
  pageSize: number = 50
): Promise<ApiResponse<PatientDiagnosesResponse>> => {
  const response = await api.get(
    `/Diagnoses/case/${caseId}`,
    {
      params: {
        page,
        pageSize,
      },
    }
  );
  return response.data;
};

// ─────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────

/**
 * Update diagnosis (PATCH or PUT)
 * PUT /api/v2/Diagnoses/{id}
 */
export const updateDiagnosis = (
  diagnosisId: string,
  data: Partial<UpdateDiagnosisDto>
) => {
  return api.put(`/Diagnoses/${diagnosisId}`, data);
};

/**
 * Accept diagnosis
 * POST /api/v2/Diagnoses/{id}/accept
 */
export const acceptDiagnosis = (diagnosisId: string) => {
  return api.post(`/Diagnoses/${diagnosisId}/accept`);
};

// ─────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────

export const deleteDiagnosis = (diagnosisId: string) => {
  return api.delete(`/Diagnoses/${diagnosisId}`);
};
