import { ApiResponse } from "./api";
import { CaseType } from "@/features/cases/types/caseCardProps.types";

export interface CaseTypeResponse extends ApiResponse<{
    items: CaseType[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}> {}
