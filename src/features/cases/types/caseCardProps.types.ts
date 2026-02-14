import { ApiResponse } from "@/types/api";

export interface CaseCardProps {
    caseItem: CaseItem;
}

export interface CaseItem {
    id: string;
    patientId: string;
    patientName: string;
    patientAge: number;
    caseType: CaseType | null;
    status: string;
    createAt: string;
    totalSessions: number;
    pendingRequests: number;
}

export interface CaseType {
    id: string;
    name: string;
    description: string;
}

export type Cases = CaseCardProps["caseItem"][];

export type AvailableCasesResponse = ApiResponse<Cases>;