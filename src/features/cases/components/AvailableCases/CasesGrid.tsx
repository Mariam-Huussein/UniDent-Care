import CaseCard from "../CaseCard";
import { CaseItem } from "../../types/caseCardProps.types";
import CasesGridSkeleton from "./CasesGridSkeleton";
import EmptyState from "./EmptyState";
import Pagination from "@/components/common/pagination";
import GridControlsToolbar from "./GridControlsToolbar";
import { SortConfig } from "../../hooks/useFilterCases";


interface CasesGridProps {
    cases: CaseItem[];
    loading: boolean;
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    sortConfig: SortConfig;
    onSort: (key: string) => void;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    onPageChange: (page: number) => void;
}

export default function CasesGrid({
    cases, loading, filters, onFilterChange, clearFilters, hasActiveFilters,
    sortConfig, onSort, pageSize, currentPage, totalPages, hasPreviousPage, hasNextPage, onPageChange
}: CasesGridProps) {

    return (
        <>
            <GridControlsToolbar
                filters={filters}
                onFilterChange={onFilterChange}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                sortConfig={sortConfig}
                onSort={onSort}
            />

            {loading ? (
                <CasesGridSkeleton pageSize={pageSize} />
            ) :
                cases.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 justify-items-center-safe">
                            {cases.map((caseItem, index) => (
                                <CaseCard key={caseItem.id || index} caseItem={caseItem} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            hasPreviousPage={hasPreviousPage}
                            hasNextPage={hasNextPage}
                            onPageChange={onPageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        search={hasActiveFilters ? "filter" : ""}
                        onClear={clearFilters}
                    />
                )
            }
        </>
    );
}
