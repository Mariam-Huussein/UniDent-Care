import { Briefcase, LayoutGrid, List } from "lucide-react";

interface CasesHeaderProps {
    totalCases: number;
    showingCases: number;
    viewMode: 'grid' | 'table';
    setViewMode: (value: 'grid' | 'table') => void;
}

export default function CasesHeader({ totalCases, showingCases, viewMode, setViewMode }: CasesHeaderProps) {
    return (
        <div className="relative z-10 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 shadow-xl shadow-gray-100/50 dark:shadow-none p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 overflow-hidden backdrop-blur-xl transition-colors duration-300">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 dark:from-indigo-500/10 dark:to-blue-500/10 blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-linear-to-tr from-emerald-50 to-teal-50 dark:from-teal-500/10 dark:to-emerald-500/10 blur-3xl opacity-60 pointer-events-none" />

            <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-5 sm:gap-6">
                
                {/* Title Section */}
                <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white transition-all">
                            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight transition-colors">
                            Available Cases
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-base max-w-lg sm:pl-[60px] transition-colors">
                        Browse active patient cases, filter by type, and find the perfect match for your clinical requirements.
                    </p>
                </div>

                {/* Live Stats + View Toggle */}
                <div className="flex items-center justify-between xl:justify-end flex-wrap gap-3 sm:pl-[60px] xl:pl-0 w-full xl:w-auto mt-2 xl:mt-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs sm:text-sm font-medium border border-emerald-100 dark:border-emerald-500/20 transition-colors">
                        <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-emerald-400"></span>
                        </span>
                        <span className="truncate">{totalCases} Available</span>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 rounded-lg text-xs sm:text-sm font-medium border border-gray-100 dark:border-slate-700 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-slate-500 shrink-0"></span>
                        <span className="truncate">{showingCases} Showing</span>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 transition-colors ml-auto xl:ml-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center justify-center p-1.5 sm:px-3 sm:py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center justify-center p-1.5 sm:px-3 sm:py-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
                            title="Table View"
                        >
                            <List className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}