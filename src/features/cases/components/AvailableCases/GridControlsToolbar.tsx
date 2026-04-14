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

export default function GridControlsToolbar({
  filters,
  onFilterChange,
  clearFilters,
  hasActiveFilters,
  sortConfig,
  onSort
}: GridControlsToolbarProps) {
  const patientSearch = filters["patientName"] || "";

  return (
    <div className="w-full mb-6 relative z-20">
      <div
        className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 p-3 lg:p-4 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      >
        {/* LEFT SIDE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">

          {/* Filter Label */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <ListFilter className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              Filters
            </span>
          </div>

          {/* Search + Dropdown Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-1">

            {/* Search */}
            <div className="relative flex-1 min-w-[180px] group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-[15px] w-[15px] text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>

              <input
                type="text"
                placeholder="Search patient..."
                value={patientSearch}
                onChange={(e) =>
                  onFilterChange("patientName", e.target.value)
                }
                className="w-full pl-9 pr-9 py-2.5 bg-white/70 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 shadow-inner transition-all"
              />

              {patientSearch && (
                <button
                  onClick={() => onFilterChange("patientName", "")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Case Type */}
            <div className="w-full sm:w-48">
              <CaseTypeDropdown
                selectedCaseType={filters["caseType"] || ""}
                setSelectedCaseType={(val) =>
                  onFilterChange("caseType", val)
                }
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">

          {/* Sort */}
          <div className="flex items-center flex-wrap gap-1 p-1.5 bg-white/60 rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
              Sort
            </span>

            {SORT_OPTIONS.map((option) => {
              const isActive = sortConfig?.key === option.key;

              return (
                <button
                  key={option.key}
                  onClick={() => onSort(option.key)}
                  className={`
                    flex items-center gap-1
                    px-3 py-1.5 rounded-lg text-sm
                    transition-all
                    ${
                      isActive
                        ? "bg-white text-indigo-700 shadow ring-1 ring-indigo-100 font-semibold"
                        : "text-gray-500 hover:text-gray-800 hover:bg-white/70"
                    }
                  `}
                >
                  {option.label}

                  {isActive &&
                    (sortConfig.direction === "asc" ? (
                      <ArrowUp size={14} className="text-indigo-500" />
                    ) : (
                      <ArrowDown size={14} className="text-indigo-500" />
                    ))}
                </button>
              );
            })}
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all"
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