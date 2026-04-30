import api from "@/utils/api";

export interface CreateDiagnosisDto {
  patientCaseId: string;
  stage: number; // 0: Initial, 1: Final, etc.
  caseTypeId: string;
  notes?: string;
  createdById?: string;
}

export const createDiagnosis = (data: CreateDiagnosisDto) => {
  return api.post("/Diagnoses", data);
};

export const createAIDiagnosis = (data: CreateDiagnosisDto) => {
  return api.post("/Diagnoses/ai/create", data);
};
