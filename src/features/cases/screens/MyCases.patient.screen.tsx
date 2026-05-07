"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Briefcase, LayoutGrid, List, Activity, Calendar, GraduationCap } from "lucide-react";
import { useMyCasesPatient } from "../hooks/useMyCasesPatient";
import CaseCard from "../components/CaseCard";
import Pagination from "@/components/common/pagination";
import DataTable, { Column } from "@/components/common/DataTable";
import { MyCasesSkeleton } from "../components/MyCasesStudent/MyCasesSkeleton";
import { MyCasesEmptyState } from "../components/MyCasesStudent/MyCasesEmptyState";
import { getCaseStatusConfig } from "../components/MyCasesStudent/getCaseStatusConfig";
import { PatientCaseItem, CaseItem } from "../types/caseCardProps.types";
import Link from "next/link";
import api from "@/utils/api";
import SearchableSelect from "@/components/common/SearchableSelect";
import { useLanguage } from "@/components/providers/LanguageProvider";

const mapPatientCaseToCaseItem = (item: PatientCaseItem): CaseItem => ({
    id: item.id,
    patientId: item.patientId,
    patientName: item.patientName,
    patientAge: item.patientAge,
    caseType: item.diagnosisdto?.[0] ? { publicId: "", name: item.diagnosisdto[0]?.caseTypeName || "null", description: "" } : null,
    status: item.status,
    createAt: item.createAt,
    totalSessions: item.totalSessions,
    pendingRequests: item.pendingRequests,
    imageUrls: item.imageUrls,
    gender: undefined,
    diagnosisdto: item.diagnosisdto || null,
});

export default function MyCasesPatientScreen() {
    const { t } = useLanguage();
    const patientId = useSelector((state: RootState) => state.auth.user?.publicId) || Cookies.get("user_id") || "";
    const {
        cases, loading, search, setSearch, status, setStatus,
        page, setPage, totalPages, totalCount
    } = useMyCasesPatient(patientId);

    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [searchInput, setSearchInput] = useState(search);
    const [caseTypes, setCaseTypes] = useState<{id: string, label: string}[]>([]);

    useEffect(() => {
        const fetchCaseTypes = async () => {
            try {
                const res = await api.get('/CaseTypes', { params: { page: 1, pageSize: 100 } });
                if (res.data?.success) {
                    const types = res.data.data.items.map((item: any) => ({
                        id: item.name,
                        label: item.name
                    }));
                    setCaseTypes(types);
                }
            } catch (err) {
                console.error("Failed to fetch case types", err);
            }
        };
        fetchCaseTypes();
    }, []);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput, setSearch, setPage]);

    const casesColumns: Column<PatientCaseItem>[] = [
        {
            header: t.myCasesDiagnosis,
            accessor: "diagnosisdto",
            render: (_, row) => {
                const sc = getCaseStatusConfig(row.processStatus || row.status);
                const StatusIcon = sc.icon || Activity;
                return (
                    <div className="flex flex-col gap-1.5 items-start">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {row.diagnosisdto?.[0]?.caseTypeName || t.myCasesPending}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                            <StatusIcon size={10} className={sc.text} />
                            {row.processStatus || sc.label}
                        </span>
                    </div>
                );
            }
        },
        {
            header: t.myCasesUniversityInfo,
            accessor: "universityName",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <GraduationCap size={14} className="text-indigo-400" />
                    {val || "—"}
                </div>
            )
        },
        {
            header: t.myCasesRegisteredOn,
            accessor: "createAt",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Calendar size={14} className="text-amber-500" />
                    {new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
            )
        },
        {
            header: "",
            accessor: "id",
            render: (val) => (
                <Link href={`/my-cases/${val}`} className="my-btn-outline px-3 py-1.5 text-xs float-right">
                    {t.myCasesViewDetails}
                </Link>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
            {/* Header */}
            <div className="relative z-[1000] rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 mb-8 backdrop-blur-xl transition-all duration-300">
                <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white shrink-0">
                            <Briefcase size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                {t.myCasesTitle}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium flex items-center gap-2">
                                {t.myCasesSubtitle}
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {totalCount} {t.myCasesTotal}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="w-full sm:w-72 relative z-[9999]">
                            <SearchableSelect
                                options={[{ id: "", label: t.myCasesAllTypes }, ...caseTypes]}
                                value={searchInput}
                                onChange={(val) => setSearchInput(val as string)}
                                placeholder={t.myCasesSearchType}
                                searchPlaceholder={t.myCasesSearch}
                                accentColor="indigo"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-full sm:w-56 relative z-[9999]">
                                <SearchableSelect
                                    options={[
                                        { id: "", label: t.myCasesAllStatuses },
                                        { id: "Pending",   label: t.myCasesPending },
                                        { id: "Approved",  label: t.myCasesApproved },
                                        { id: "Completed", label: t.myCasesCompleted },
                                    ]}
                                    value={status}
                                    onChange={(val) => {
                                        setStatus(val as string);
                                        setPage(1);
                                    }}
                                    placeholder={t.myCasesFilterStatus}
                                    accentColor="indigo"
                                    showSearch={false}
                                />
                            </div>

                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

                            <div className="flex bg-slate-100 dark:bg-slate-950/50 p-1 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* List / Grid Content */}
            <motion.div
                key="cases"
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
                    <MyCasesEmptyState message={t.myCasesEmpty} />
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
                                                caseItem={mapPatientCaseToCaseItem(item)}
                                                hideRequestButton={true}
                                                navigationPath="/my-cases"
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
