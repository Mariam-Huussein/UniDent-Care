import { Briefcase, Send, LayoutGrid, List, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CaseTypeDropdown from "../AvailableCases/CaseTypeDropdown";
import { MyCasesTab } from "../../hooks/useMyCasesStudent";

export default function MyCasesHeader({
    activeTab, setActiveTab, casesTotalCount, requestsTotalCount,
    caseType, setCaseType, casesLoading, casesViewMode, setCasesViewMode, requestsViewMode, setRequestsViewMode
}: {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<MyCasesTab>>;
    casesTotalCount: number;
    requestsTotalCount: number;
    caseType: string;
    setCaseType: (caseType: string) => void;
    casesLoading: boolean;
    casesViewMode: "grid" | "table";
    setCasesViewMode: (viewMode: "grid" | "table") => void;
    requestsViewMode: "grid" | "table";
    setRequestsViewMode: (val: "grid" | "table") => void;
}) {

    const currentViewMode = activeTab === "cases" ? casesViewMode : requestsViewMode;
    const setViewMode = activeTab === "cases" ? setCasesViewMode : setRequestsViewMode;

    return (
        <div className="relative z-10 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 mb-8 overflow-hidden backdrop-blur-xl transition-all duration-300">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-indigo-50 dark:bg-indigo-500/5 blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-emerald-50 dark:bg-emerald-500/5 blur-3xl opacity-60 pointer-events-none" />

            <div className="relative flex flex-col gap-8">
                {/* Upper Row: Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                                <Briefcase size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    My Cases Dashboard
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium">
                                    {activeTab === "cases" ? "View and manage your registered patient cases." : "Track your sent requests and their status."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {casesLoading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                <Loader2 size={16} className="animate-spin text-indigo-500" />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Syncing...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Lower Row: Controls */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/60">

                    {/* Tabs */}
                    <div className="flex bg-slate-100/80 dark:bg-slate-950/50 p-1.5 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 w-fit">
                        {[
                            { id: "cases", label: "Cases", icon: Briefcase, count: casesTotalCount },
                            { id: "requests", label: "Requests", icon: Send, count: requestsTotalCount },
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as MyCasesTab)}
                                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isActive ? "text-indigo-600 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                                >
                                    {isActive && (
                                        <motion.div layoutId="header-active-pill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <tab.icon size={16} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "opacity-60"} />
                                        {tab.label}
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                                            {tab.count}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="min-w-[160px]">
                            <CaseTypeDropdown
                                selectedCaseType={caseType}
                                setSelectedCaseType={setCaseType}
                            />
                        </div>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

                        <div className="flex bg-slate-100 dark:bg-slate-950/50 p-1 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${currentViewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-all ${currentViewMode === 'table' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}