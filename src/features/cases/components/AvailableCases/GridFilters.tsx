import { Search, X, SlidersHorizontal } from "lucide-react";
import CaseTypeDropdown from "./CaseTypeDropdown";

interface GridFiltersProps {
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
}

export default function GridFilters({ filters, onFilterChange, clearFilters, hasActiveFilters }: GridFiltersProps) {
    const patientSearch = filters["patientName"] || "";
    const caseType = filters["caseType"] || "";

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-5">
            {/* Filter icon label */}
            <div className="flex items-center gap-2 text-gray-500 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Filters</span>
            </div>

            {/* Patient Name Search */}
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search by patient name..."
                    value={patientSearch}
                    onChange={(e) => onFilterChange("patientName", e.target.value)}
                    className="block w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
                />
                {patientSearch && (
                    <button
                        onClick={() => onFilterChange("patientName", "")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Case Type Dropdown */}
            <div className="sm:w-56 shrink-0">
                <CaseTypeDropdown
                    selectedCaseType={caseType}
                    setSelectedCaseType={(val) => onFilterChange("caseType", val)}
                />
            </div>

            {/* Clear All */}
            {hasActiveFilters && (
                <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium shrink-0 cursor-pointer transition-colors"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}
