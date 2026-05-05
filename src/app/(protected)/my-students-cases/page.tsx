"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Users, LayoutGrid, List, Activity, GraduationCap, Calendar, Briefcase, CheckCircle2, Clock } from "lucide-react";
import CaseCard from "@/features/cases/components/CaseCard";
import Pagination from "@/components/common/pagination";
import DataTable, { Column } from "@/components/common/DataTable";
import { useDoctorCases } from "@/features/cases/hooks/useDoctorCases";
import { CaseItem } from "@/features/cases/types/caseCardProps.types";
import { getCaseStatusConfig } from "@/features/cases/components/MyCasesStudent/getCaseStatusConfig";
import { MyCasesSkeleton } from "@/features/cases/components/MyCasesStudent/MyCasesSkeleton";
import { MyCasesEmptyState } from "@/features/cases/components/MyCasesStudent/MyCasesEmptyState";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";
import GridControlsToolbar from "@/features/cases/components/AvailableCases/GridControlsToolbar";
import { SortConfig } from "@/features/cases/hooks/useFilterCases";

const mapDoctorCaseToCaseItem = (item: any): CaseItem => ({
    id: item.id,
    patientId: item.patientId,
    patientName: item.patientName,
    patientAge: item.patientAge,
    caseType: item.diagnoses?.[0] ? { publicId: "", name: item.diagnoses[0]?.caseTypeName || "null", description: "" } : null,
    status: item.status,
    createAt: item.createAt,
    totalSessions: item.totalSessions,
    pendingRequests: item.pendingRequests,
    imageUrls: item.imageUrls,
    gender: undefined,
    diagnosisdto: item.diagnoses || item.diagnosisdto || null,
});

const mapCaseRequestToCaseItem = (item: any): CaseItem => ({
    id: item.patientCasePublicId || item.id,
    patientId: "",
    patientName: item.patientName || item.studentName || "Unknown",
    patientAge: 0,
    caseType: item.caseName ? { publicId: "", name: item.caseName, description: item.description || "" } : null,
    status: item.status || "Pending",
    createAt: item.createAt,
    imageUrls: [],
    gender: undefined,
    diagnosisdto: null,
});

const TABS = [
    { id: "In Progress", label: "In Progress", icon: Activity },
    { id: "Completed", label: "Completed", icon: CheckCircle2 },
];

export default function MyStudentCasesPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const doctorId = (user as any)?.publicId ?? (user as any)?.id ?? Cookies.get("user_id");
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    const {
        cases, loading, search, setSearch, caseType, setCaseType,
        page, setPage, totalPages, totalCount
    } = useDoctorCases(doctorId, activeTab);

    // Filter bridge
    const filters = {
        patientName: search,
        caseType: caseType
    };

    const handleFilterChange = (key: string, value: string) => {
        if (key === "patientName") setSearch(value);
        if (key === "caseType") setCaseType(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setCaseType("");
        setSortConfig(null);
        setPage(1);
    };

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (!prev || prev.key !== key) return { key, direction: "asc" };
            if (prev.direction === "asc") return { key, direction: "desc" };
            return null;
        });
    };

    const casesColumns: Column<any>[] = [
        {
            header: "Diagnosis",
            accessor: "diagnoses",
            render: (_, row) => {
                const sc = getCaseStatusConfig(row.processStatus || row.status);
                const StatusIcon = sc.icon || Activity;
                return (
                    <div className="flex flex-col gap-1.5 items-start">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{row.diagnoses?.[0]?.caseTypeName || "Pending"}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                            <StatusIcon size={10} className={sc.text} />
                            {row.processStatus || sc.label}
                        </span>
                    </div>
                )
            }
        },
        {
            header: "Patient",
            accessor: "patientName",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                    {val || "—"}
                </div>
            )
        },
        {
            header: "Registered On",
            accessor: "createAt",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Calendar size={14} className="text-amber-500" />
                    {new Date(val).toLocaleDateString(isRtl ? "ar-EG" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
            )
        },
        {
            header: "",
            accessor: "id",
            render: (val) => (
                <Link href={`/cases/${val}`} className="my-btn-outline px-3 py-1.5 text-xs float-right">
                    View Details
                </Link>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300" dir={isRtl ? "rtl" : "ltr"}>
            
            {/* ── Dashboard Header (Synced with Student UI) ── */}
            <div className="relative z-50 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 mb-8 overflow-hidden backdrop-blur-xl transition-all duration-300">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-indigo-50 dark:bg-indigo-500/5 blur-3xl opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-emerald-50 dark:bg-emerald-500/5 blur-3xl opacity-60 pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left Side: Title and Syncing Loader */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                                <Users size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                                    Student Cases
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                                    Review and manage cases assigned to you.
                                </p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full w-fit">
                                    <Loader2 size={14} className="animate-spin text-indigo-500" />
                                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Syncing...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Controls (Tabs & View Mode) */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Tabs */}
                        <div className="flex bg-slate-100/80 dark:bg-slate-950/50 p-1 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 w-fit">
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${isActive ? "text-indigo-600 dark:text-indigo-300" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                                    >
                                        {isActive && (
                                            <motion.div layoutId="header-active-pill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Icon size={14} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "opacity-60"} />
                                            {tab.label}
                                            {isActive && activeTab === tab.id && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                                                    {totalCount}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Vertical Divider */}
                        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

                        {/* View Mode Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-950/50 p-1 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Filters Section (Using GridControlsToolbar) ── */}
            <GridControlsToolbar 
                filters={filters}
                onFilterChange={handleFilterChange}
                clearFilters={clearFilters}
                hasActiveFilters={!!search || !!caseType || !!sortConfig}
                sortConfig={sortConfig}
                onSort={handleSort}
                hideGender={true}
            />

            {/* ── Content Area ── */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
            >
                {loading ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                            {Array.from({ length: 6 }).map((_, i) => <MyCasesSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="space-y-4 pt-4">
                            <div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                            <div className="w-full h-12 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                        </div>
                    )
                ) : cases.length === 0 ? (
                    <MyCasesEmptyState message="No cases found matching your criteria." />
                ) : (
                    viewMode === 'grid' ? (
                        <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                            <AnimatePresence>
                                {cases.map((item, i) => {
                                    const sc = getCaseStatusConfig(item.processStatus || item.status);
                                    const StatusIcon = sc.icon || Activity;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.4, delay: i * 0.05, type: 'spring', bounce: 0.3 }}
                                            className="w-full flex justify-center h-full"
                                        >
                                            <CaseCard
                                                caseItem={mapDoctorCaseToCaseItem(item)}
                                                hideRequestButton={true}
                                                navigationPath="/my-students-cases"
                                                customBadge={
                                                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full p-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-none ring-1 ring-white/50 dark:ring-slate-700">
                                                        <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                                                            {item.processStatus === 'In Progress' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                            {item.processStatus !== 'In Progress' && <StatusIcon size={12} className={sc.text} />}
                                                            {item.processStatus || sc.label}
                                                        </span>
                                                    </div>
                                                }
                                            />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                            <DataTable columns={casesColumns} data={cases} />
                        </motion.div>
                    )
                )}

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    hasPreviousPage={page > 1}
                    hasNextPage={page < totalPages}
                    onPageChange={setPage}
                />
            </motion.div>
        </div>
    );
}

