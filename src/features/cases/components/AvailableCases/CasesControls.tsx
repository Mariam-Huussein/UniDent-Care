import SelectItems from "../../../../components/common/SelectItems";
import { Search, X } from "lucide-react";

interface CasesControlsProps {
    search: string;
    setSearch: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    sortOptions: string[];
}

export default function CasesControls({ search, setSearch, sortBy, setSortBy, sortOptions }: CasesControlsProps) {
    return (
        <div className="relative flex flex-col sm:flex-row gap-3">
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

            {/* Sort Dropdown */}
            <div className="sm:w-48 flex-shrink-0">
                <SelectItems
                    value={sortBy}
                    onChange={setSortBy}
                    options={sortOptions}
                />
            </div>
        </div>
    );
}
