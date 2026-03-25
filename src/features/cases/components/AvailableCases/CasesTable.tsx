import DataTable, { Column } from "@/components/common/DataTable";
import { CaseItem } from "../../types/caseCardProps.types";
import { Eye, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SendRequestModal from "../CaseCard/SendRequestModal";
import CaseTypeDropdown from "./CaseTypeDropdown";
import EmptyState from "./EmptyState";

interface CasesTableProps {
    cases: CaseItem[];
    loading: boolean;
    search: string;
    setSearch: (value: string) => void;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export default function CasesTable({
    cases,
    loading,
    search,
    setSearch,
    hasPreviousPage,
    hasNextPage,
    currentPage,
    totalPages,
    pageSize,
    onPageChange
}: CasesTableProps) {
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

    const columns: Column<CaseItem>[] = [
        { header: "Patient", accessor: "patientName", sortable: true, searchable: true },
        { header: "Age", accessor: "patientAge", sortable: true },
        {
            header: "Case Type",
            accessor: "caseType",
            searchable: true,
            filterComponent: ({ value, onChange }) => (
                <div className="w-full relative group">
                    <CaseTypeDropdown
                        selectedCaseType={value}
                        setSelectedCaseType={onChange}
                        variant="inline"
                        placeholder="Case Type"
                    />
                </div>
            )
        },
        { header: "Date Added", accessor: "createAt", sortable: true },
        { header: "Actions", accessor: "id" }
    ];

    // Data Mapping for display formatting
    const tableData = cases.map((c) => ({
        ...c,
        caseType: c.caseType?.name || "N/A",
        createAt: new Date(c.createAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        status: (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${c.status === "Available"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}>
                {c.status}
            </span>
        ),
        id: (
            <div className="flex gap-2 items-center">
                <Link
                    href={`/cases/${c.id}`}
                    className="my-btn-outline !flex-none p-2 flex items-center justify-center rounded-lg"
                    title="View details"
                >
                    <Eye size={16} />
                </Link>
                <button
                    onClick={() => setSelectedCaseId(c.id) }
                    className="my-btn-outline !flex-none p-2 flex items-center justify-center rounded-lg group-hover/request:animate-bounce group-hover/request:animate-duration-1000 transition-all duration-300"
                    title="Send request"
                >
                    <Send size={16} />
                </button>
            </div>
        )
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
            </div>
        );
    }

    if (cases.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col justify-center">
                <EmptyState search={search} onClear={() => setSearch("")} />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <DataTable columns={columns as any} data={tableData} />

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100 gap-4">
                <div className="text-sm text-gray-500">
                    Showing <span className="font-medium text-gray-900">{cases.length}</span> cases
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPreviousPage}
                        className={`${!hasPreviousPage ? "hidden" : ""} px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 font-medium px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className={`${!hasNextPage ? "hidden" : ""} px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {(() => {
                const selectedCase = cases.find(c => c.id === selectedCaseId);
                return selectedCase ? (
                    <SendRequestModal
                        caseId={selectedCase.id}
                        patientName={selectedCase.patientName}
                        caseType={selectedCase.caseType?.name || undefined}
                        onClose={() => setSelectedCaseId(null)}
                    />
                ) : null;
            })()}
        </div>
    );
}
