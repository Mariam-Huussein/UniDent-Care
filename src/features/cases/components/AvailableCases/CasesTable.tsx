import DataTable, { Column } from "@/components/common/DataTable";
import { CaseItem } from "../../types/caseCardProps.types";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SendRequestModal from "../CaseCard/SendRequestModal";
import CaseTypeDropdown from "./CaseTypeDropdown";

interface CasesTableProps {
    cases: CaseItem[];
    loading: boolean;
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
        { header: "Requests", accessor: "pendingRequests", sortable: true },
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
                : "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                {c.status}
            </span>
        ),
        id: (
            <div className="flex gap-2 items-center">
                <Link
                    href={`/cases/${c.id}`}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                >
                    <Eye className="w-5 h-5" />
                </Link>
                <button
                    onClick={() => setSelectedCaseId(c.id)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                    Request
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
            <div className="text-center py-12 text-gray-500">
                No cases match your filters.
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
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 font-medium px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
