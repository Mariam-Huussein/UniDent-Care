import CaseCard from "../CaseCard";
import { CaseItem } from "../../types/caseCardProps.types";
import CasesGridSkeleton from "./CasesGridSkeleton";
import EmptyState from "./EmptyState";
import Pagination from "@/components/common/pagination";


interface CasesGridProps {
    cases: CaseItem[];
    loading: boolean;
    search: string;
    setSearch: (value: string) => void;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    onPageChange: (page: number) => void;
}

export default function CasesGrid({ cases, loading, search, setSearch, pageSize, currentPage, totalPages, hasPreviousPage, hasNextPage, onPageChange }: CasesGridProps) {

    return (
        <>
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
                    <EmptyState search={search} onClear={() => setSearch("")} />
                )
            }
        </>
    );
}
