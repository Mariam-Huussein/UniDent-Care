import { CaseType } from "@/features/cases/types/caseCardProps.types";
import { ApiResponse } from "@/types/api";

export interface CaseTypeResponse extends ApiResponse<{
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    items: CaseType[];
}> { }