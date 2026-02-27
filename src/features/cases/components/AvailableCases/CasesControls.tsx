import { Search, X, LayoutGrid, List } from "lucide-react";
import CaseTypeDropdown from "./CaseTypeDropdown";
import { title } from "process";

interface CasesControlsProps {
    search: string;
    setSearch: (value: string) => void;
    selectedCaseType: string;
    setSelectedCaseType: (value: string) => void;
    viewMode: 'grid' | 'table';
    setViewMode: (value: 'grid' | 'table') => void;
}

export default function CasesControls({ search, setSearch, selectedCaseType, setSelectedCaseType, viewMode, setViewMode }: CasesControlsProps) {
    return (
        <div className="relative flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Field */}
            <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search by patient, case type, or status..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-11 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Case Type Dropdown */}
            <div className="sm:w-64 shrink-0 flex items-stretch child-h-full">
                <CaseTypeDropdown
                    selectedCaseType={selectedCaseType}
                    setSelectedCaseType={setSelectedCaseType}
                />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                    title="Grid View"
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                    title="Table View"
                >
                    <List className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
