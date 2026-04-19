import DataTable, { Column } from "@/components/common/DataTable";
import { CaseItem } from "../../types/caseCardProps.types";
import { Eye, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import SendRequestModal from "../CaseCard/SendRequestModal";
import CaseTypeDropdown from "./CaseTypeDropdown";
import EmptyState from "./EmptyState";
import { SortConfig } from "../../hooks/useFilterCases";
import SelectItems from "@/components/common/SelectItems";

interface CasesTableProps {
    cases: CaseItem[];
    loading: boolean;
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    sortConfig: SortConfig;
    onSort: (key: string) => void;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

const getGenderLabel = (gender?: 0 | 1): string => {
    if (gender === 0) return "Male";
    if (gender === 1) return "Female";
    return "Unknown";
};

const GENDER_OPTIONS = [
  { value: "", label: "All Genders" },
  { value: "0", label: "Male" },
  { value: "1", label: "Female" },
];

export default function CasesTable({
    cases, loading, filters, onFilterChange, clearFilters, hasActiveFilters,
    sortConfig, onSort,
    hasPreviousPage, hasNextPage, currentPage, totalPages, pageSize, onPageChange
}: CasesTableProps) {
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const gender = filters["gender"] !== undefined && filters["gender"] !== null ? String(filters["gender"]) : "";

  const selectedGenderLabel = GENDER_OPTIONS.find(opt => opt.value === gender)?.label || "All Genders";

    const columns: Column<CaseItem>[] = [
        { header: "Patient", accessor: "patientName", sortable: true, searchable: true },
        { header: "Age", accessor: "patientAge", sortable: true },
        { header: "Gender", accessor: "gender",
            searchable: true,
            filterComponent: ({ value, onChange }) => (
            <div className="sm:w-48 min-w-[140px] shrink-0 relative z-30">
              <SelectItems
                value={selectedGenderLabel}
                onChange={(selectedLabel) => {
                  const selectedOption = GENDER_OPTIONS.find(opt => opt.label === selectedLabel);
                  onFilterChange("gender", selectedOption ? selectedOption.value : "");
                }}
                options={GENDER_OPTIONS.map(opt => opt.label)}
                placeholder="All Genders"
                variant="inline"
              />
            </div>
            )


         },
        {
            header: "Case Type",
            accessor: "caseType",
            searchable: true,
            filterComponent: ({ value, onChange }) => (
                <div className="w-full min-w-[140px] relative group">
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

    const tableData = cases.map((c) => ({
        ...c,
        caseType: c.diagnosisdto?.map((d) => d.caseType).join(", ") || "Uncategorized",
        gender: c.gender !== undefined ? getGenderLabel(c.gender) : "Unknown",
        createAt: new Date(c.createAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        status: (
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-colors ${c.status === "Available"
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20"
                }`}>
                {c.status}
            </span>
        ),
        id: (
            <div className="flex gap-2 items-center">
                <Link
                    href={`/cases/${c.id}`}
                    className="my-btn-outline flex-none p-2 flex items-center justify-center rounded-lg group/view"
                    title="View details"
                >
                    <Eye size={16} className="group-hover/view:animate-pulse group-hover/view:animate-duration-1000 transition-all duration-300" />
                </Link>
                <button
                    onClick={() => setSelectedCaseId(c.id)}
                    className="my-btn-outline flex-none p-2 flex items-center justify-center rounded-lg group/request"
                    title="Send request"
                >
                    <Send size={16} className="group-hover/request:animate-bounce group-hover/request:animate-duration-1000 transition-all duration-300" />
                </button>
            </div>
        )
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 rounded-full border-4 border-emerald-100 dark:border-slate-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
            <DataTable
                columns={columns as any}
                data={tableData}
                filters={filters}
                onFilterChange={onFilterChange}
                sortConfig={sortConfig}
                onSort={onSort}
                emptyStateComponent={
                    <div className="p-4">
                        <EmptyState
                            search={hasActiveFilters ? "filter" : ""}
                            onClear={clearFilters}
                        />
                    </div>
                }
            />

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-100 dark:border-slate-800 gap-4 transition-colors">
                <div className="text-sm text-gray-500 dark:text-slate-400">
                    Showing <span className="font-medium text-gray-900 dark:text-slate-100">{cases.length}</span> cases
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPreviousPage}
                        className={`${!hasPreviousPage ? "hidden" : ""} px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600 dark:text-slate-400 font-medium px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className={`${!hasNextPage ? "hidden" : ""} px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
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
