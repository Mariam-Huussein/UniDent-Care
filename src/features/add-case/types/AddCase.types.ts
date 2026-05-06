export type Step = "lookup" | "patient-form" | "patient-found" | "add-case";


export interface PatientData {
  publicId: string;
  fullName: string;
  phone: string;
  nationalId: string;
  age: number;
  gender: number;
  city: number;
  email?: string;
  createAt?: string;
  patientCases?: { id: string; status: number; createAt: string; name: string }[];
}

export interface PatientLookupResponse {
  success: boolean;
  message?: string;
  data?: {
    items: PatientData[];
  };
}

export interface PatientCreateResponse {
  success: boolean;
  message?: string;
  data?: string; // publicId UUID
}

export interface DiagnosisHistoryItem {
  id: string;
  caseTypeName: string;
  stage: number | string;
  notes: string;
  teethNumbers: number[];
  createAt?: string;
}

export interface CaseDiagnosisDto {
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

export interface CaseDetail {
  id: string;
  patientId: string;
  patientName: string;
  status: string;
  diagnosisdto: CaseDiagnosisDto[];
  imageUrls: string[];
}

export interface CaseDetailResponse {
  success: boolean;
  data?: CaseDetail;
}

/** Maps tooth FDI number → existing case info */
export interface ExistingToothCase {
  caseId: string;
  diagnosis: CaseDiagnosisDto;
}
