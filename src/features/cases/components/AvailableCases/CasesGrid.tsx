import CaseCard from "../CaseCard";
import { CaseItem } from "../../types/caseCardProps.types";
import CasesGridSkeleton from "./CasesGridSkeleton";
import EmptyState from "./EmptyState";

interface CasesGridProps {
    cases: CaseItem[];
    loading: boolean;
    search: string;
    setSearch: (value: string) => void;
}

export default function CasesGrid({ cases, loading, search, setSearch }: CasesGridProps) {
    if (loading) {
        return (
            <CasesGridSkeleton />
        );
    }

    return (
        <>
            {
                cases.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 justify-items-center-safe">
                        {cases.map((caseItem, index) => (
                            <CaseCard key={caseItem.id || index} caseItem={caseItem} />
                        ))}
                    </div>

                ) : (
                    <EmptyState search={search} onClear={() => setSearch("")} />
                )
            }
        </>
    );
}
