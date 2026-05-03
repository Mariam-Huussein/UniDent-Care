"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Users, LayoutGrid, List, Activity, GraduationCap, Calendar } from "lucide-react";
import CaseCard from "@/features/cases/components/CaseCard";
import Pagination from "@/components/common/pagination";
import DataTable, { Column } from "@/components/common/DataTable";
import SearchableSelect from "@/components/common/SearchableSelect";
import api from "@/utils/api";
import { useDoctorCases } from "@/features/cases/hooks/useDoctorCases";
import { PatientCaseItem, CaseItem } from "@/features/cases/types/caseCardProps.types";
import { getCaseStatusConfig } from "@/features/cases/components/MyCasesStudent/getCaseStatusConfig";
import { MyCasesSkeleton } from "@/features/cases/components/MyCasesStudent/MyCasesSkeleton";
import { MyCasesEmptyState } from "@/features/cases/components/MyCasesStudent/MyCasesEmptyState";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

const TABS = ["Under Review", "In Progress", "Completed"];

export default function MyStudentCasesPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const doctorId = (user as any)?.publicId ?? (user as any)?.id ?? Cookies.get("user_id");
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const [activeTab, setActiveTab] = useState(TABS[0]);
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    
    // Filters State for UI input
    const [searchInput, setSearchInput] = useState("");
    const [caseTypes, setCaseTypes] = useState<{id: string, label: string}[]>([]);

    const {
        cases, loading, search, setSearch, caseType, setCaseType,
        page, setPage, totalPages, totalCount
    } = useDoctorCases(doctorId, activeTab);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput, setSearch]);

    useEffect(() => {
        const fetchCaseTypes = async () => {
            try {
                const res = await api.get('/CaseTypes', { params: { page: 1, pageSize: 100 } });
                if (res.data?.success) {
                    const types = res.data.data.items.map((t: any) => ({
                        id: t.name,
                        label: t.name
                    }));
                    setCaseTypes(types);
                }
            } catch (err) {
                console.error("Failed to fetch case types", err);
            }
        };
        fetchCaseTypes();
    }, []);

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
            {/* Header */}
            <div className="relative z-20 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 mb-8 backdrop-blur-xl transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-indigo-50 dark:bg-indigo-500/5 blur-3xl opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-emerald-50 dark:bg-emerald-500/5 blur-3xl opacity-60 pointer-events-none" />

                <div className="relative flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white shrink-0">
                            <Users size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Student Cases
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium flex items-center gap-2 mt-1">
                                Review and manage cases assigned to you
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {totalCount} Total
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Tabs only in this area */}
                    <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl self-start overflow-x-auto max-w-full custom-scrollbar ring-1 ring-slate-200 dark:ring-slate-800">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all duration-300 ${
                                    activeTab === tab
                                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-slate-200 dark:ring-slate-600"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                                }`}
                            >
                                {tab} Cases
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Filters Section - Moved Below Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/30 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 backdrop-blur-sm relative z-30">
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <div className="relative w-full sm:w-80">
                        <Search className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 shadow-sm`}
                        />
                    </div>

                    <div className="w-full sm:w-80 relative z-[100]">
                        <SearchableSelect
                            options={[{ id: "", label: "All Case Types" }, ...caseTypes]}
                            value={caseType}
                            onChange={(val) => setCaseType(val as string)}
                            placeholder="Search case type..."
                            searchPlaceholder="Search..."
                            accentColor="indigo"
                            isRtl={isRtl}
                        />
                    </div>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-950/50 p-1 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800 shrink-0 self-end md:self-center">
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
