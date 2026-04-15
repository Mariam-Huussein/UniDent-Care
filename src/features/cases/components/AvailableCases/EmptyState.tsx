import { SearchX, Inbox } from "lucide-react";

interface EmptyStateProps {
    search: string;
    onClear: () => void;
}

export default function EmptyState({ search, onClear }: EmptyStateProps) {
    return (
        <div className="relative w-full overflow-hidden flex flex-col items-center justify-center py-24 px-6 text-center 
            bg-white dark:bg-slate-800 
            rounded-3xl border 
            border-gray-100 dark:border-slate-700/60 
            shadow-xl shadow-gray-100/50 dark:shadow-none">

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full blur-[80px] opacity-70 pointer-events-none
                bg-linear-to-br from-blue-50 to-indigo-50 
                dark:from-indigo-900/20 dark:to-blue-900/20" />

            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 rounded-full blur-[80px] opacity-70 pointer-events-none
                bg-linear-to-tr from-emerald-50 to-teal-50 
                dark:from-teal-900/20 dark:to-emerald-900/20" />

            <div className="relative z-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-full animate-ping duration-1000 opacity-50
                        bg-indigo-50 dark:bg-indigo-500/20"></div>
                    <div className="absolute inset-0 rounded-full animate-pulse opacity-50
                        bg-indigo-100 dark:bg-indigo-500/30"></div>

                    {/* Icon container */}
                    <div className={`relative w-full h-full rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all transform hover:scale-105 duration-300
                        ${search
                            ? 'bg-linear-to-br from-indigo-500 to-indigo-700 dark:from-indigo-600 dark:to-indigo-800 shadow-blue-600/30 dark:shadow-blue-900/50'
                            : 'bg-linear-to-br from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600 shadow-indigo-500/30 dark:shadow-indigo-900/50'
                        }
                        shadow-2xl 
                        ${search
                            ? 'shadow-indigo-600/30 dark:shadow-indigo-900/50'
                            : 'shadow-teal-500/30 dark:shadow-teal-900/50'
                        }
`}>
                        {search ? (
                            <SearchX size={40} strokeWidth={2} className="dark:text-indigo-100" />
                        ) : (
                            <Inbox size={40} strokeWidth={2} className="dark:text-blue-100" />
                        )}
                    </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text tracking-tight mb-3
                    bg-linear-to-r from-gray-900 to-gray-600 
                    dark:from-white dark:to-slate-300">
                    {search ? "No Cases Found" : "No Available Cases"}
                </h3>

                <p className="text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed
                    text-gray-500 dark:text-slate-400">
                    {search
                        ? "We couldn't find any cases matching your search criteria. Try adjusting your filters or searching for something else."
                        : "There are currently no active patient cases in the system. Please check back later when new cases are added."}
                </p>

                {search && (
                    <button
                        onClick={onClear}
                        className="group relative inline-flex items-center justify-center px-3 my-btn-outline active:scale-95"
                    >
                        <span>Clear All Filters</span>
                        <SearchX className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}