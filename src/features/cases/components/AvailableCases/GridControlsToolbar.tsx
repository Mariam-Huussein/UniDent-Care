import {
  Search,
  X,
  ListFilter,
  ArrowUp,
  ArrowDown,
  RotateCcw
} from "lucide-react";
import CaseTypeDropdown from "./CaseTypeDropdown";
import { SortConfig } from "../../hooks/useFilterCases";
import SelectItems from "@/components/common/SelectItems";

interface GridControlsToolbarProps {
  filters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  sortConfig: SortConfig;
  onSort: (key: string) => void;
}

const SORT_OPTIONS = [
  { key: "patientName", label: "Name" },
  { key: "patientAge", label: "Age" },
  { key: "createAt", label: "Date" },
];

const GENDER_OPTIONS = [
  { value: "", label: "All Genders" },
  { value: "0", label: "Male" },
  { value: "1", label: "Female" },
];

export default function GridControlsToolbar({
  filters, onFilterChange, clearFilters,
  hasActiveFilters, sortConfig, onSort
}: GridControlsToolbarProps) {
  const patientSearch = filters["patientName"] || "";
  const gender = filters["gender"] != null ? String(filters["gender"]) : "";
  const selectedGenderLabel = GENDER_OPTIONS.find(opt => opt.value === gender)?.label || "All Genders";

  return (
    <div className="w-full mb-6 relative z-60">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-3 lg:p-3 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-none transition-colors">

        {/* LEFT */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0 w-full">

          {/* Filter label */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-sm shadow-indigo-500/20">
              <ListFilter className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
              Filters
            </span>
          </div>

          {/* Inputs row */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 flex-1 min-w-0">

            {/* Search */}
            <div className="relative flex-1 min-w-full sm:min-w-[160px] group">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search patient..."
                value={patientSearch}
                onChange={(e) => onFilterChange("patientName", e.target.value)}
                className="w-full pl-8 pr-8 py-2 bg-white/70 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-300 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 shadow-inner dark:shadow-none transition-all"
              />
              {patientSearch && (
                <button
                  onClick={() => onFilterChange("patientName", "")}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Case Type */}
            <div className="relative z-40">
              <CaseTypeDropdown
                selectedCaseType={filters["caseType"] || ""}
                setSelectedCaseType={(val) => onFilterChange("caseType", val)}
              />
            </div>

            {/* Gender */}
            <div className="relative z-40">
              <SelectItems
                value={selectedGenderLabel}
                onChange={(selectedLabel) => {
                  const opt = GENDER_OPTIONS.find(o => o.label === selectedLabel);
                  onFilterChange("gender", opt ? opt.value : "");
                }}
                options={GENDER_OPTIONS.map(o => o.label)}
                placeholder="All Genders"
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">

          {/* Sort */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-white/60 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 w-full sm:w-auto">
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-2 hidden sm:inline-block">
              Sort
            </span>
            <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 hidden sm:block" />
            {SORT_OPTIONS.map((option) => {
              const isActive = sortConfig?.key === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => onSort(option.key)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-400 shadow ring-1 ring-indigo-100 dark:ring-indigo-500/30 font-semibold"
                      : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 hover:bg-white/70 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {option.label}
                  {isActive && (
                    sortConfig.direction === "asc"
                      ? <ArrowUp size={13} className="text-indigo-500 dark:text-indigo-400" />
                      : <ArrowDown size={13} className="text-indigo-500 dark:text-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}