import { Briefcase } from "lucide-react";
import CasesControls from "./CasesControls";

interface CasesHeaderProps {
    totalCases: number;
    showingCases: number;
    search: string;
    setSearch: (value: string) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    sortOptions: string[];
}

export default function CasesHeader({ totalCases, showingCases, search, setSearch, sortBy, setSortBy, sortOptions }: CasesHeaderProps) {
    return (
        <div className="relative z-10 rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 p-5 sm:p-8 mb-6 sm:mb-8">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-gradient-to-tr from-emerald-50 to-teal-50 blur-3xl opacity-60 pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Title Section */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                            <Briefcase size={20} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Available Cases
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base max-w-lg ml-13">
                        Browse active patient cases, filter by type, and find the perfect match for your clinical requirements.
                    </p>
                </div>

                {/* Live Stats */}
                <div className="flex items-center gap-3 self-start md:self-auto ml-13 md:ml-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        {totalCases} Available
                    </div>
                    {/* <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-100">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                        {showingCases} Showing
                    </div> */}
                </div>
            </div>

            {/* Controls Section */}
            <CasesControls
                search={search}
                setSearch={setSearch}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOptions={sortOptions}
            />
        </div>
    );
}
