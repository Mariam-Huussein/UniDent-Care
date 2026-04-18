"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Loader2, Briefcase, LayoutGrid, List, Activity, Calendar, GraduationCap } from "lucide-react";
import { useMyCasesPatient } from "../hooks/useMyCasesPatient";
import CaseCard from "../components/CaseCard";
import Pagination from "@/components/common/pagination";
import DataTable, { Column } from "@/components/common/DataTable";
import { MyCasesSkeleton } from "../components/MyCasesStudent/MyCasesSkeleton";
import { MyCasesEmptyState } from "../components/MyCasesStudent/MyCasesEmptyState";
import { getCaseStatusConfig } from "../components/MyCasesStudent/getCaseStatusConfig";
import { PatientCaseItem, CaseItem } from "../types/caseCardProps.types";
import Link from "next/link";

const mapPatientCaseToCaseItem = (item: PatientCaseItem): CaseItem => ({
    id: item.id,
    patientId: item.patientId,
    patientName: item.patientName,
    patientAge: item.patientAge,
    caseType: item.diagnosisdto ? { publicId: "", name: item.diagnosisdto.caseType, description: "" } : null,
    status: item.status,
    createAt: item.createAt,
    totalSessions: item.totalSessions,
    pendingRequests: item.pendingRequests,
    imageUrls: item.imageUrls,
});

export default function MyCasesPatientScreen() {
    const patientId = useSelector((state: RootState) => state.auth.user?.publicId) || Cookies.get("user_id") || "";
    const {
        cases, loading, search, setSearch, status, setStatus,
        page, setPage, totalPages, totalCount
    } = useMyCasesPatient(patientId);

    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [searchInput, setSearchInput] = useState(search);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput);
            setPage(1); // Reset page on search change
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput, setSearch, setPage]);

    const casesColumns: Column<PatientCaseItem>[] = [
        {
            header: "Diagnosis",
            accessor: "diagnosisdto",
            render: (_, row) => {
                const sc = getCaseStatusConfig(row.processStatus || row.status);
                const StatusIcon = sc.icon || Activity;
                return (
                    <div className="flex flex-col gap-1.5 items-start">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{row.diagnosisdto?.caseType || "Pending"}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                            <StatusIcon size={10} className={sc.text} />
                            {row.processStatus || sc.label}
                        </span>
                    </div>
                )
            }
        },
        {
            header: "University Info",
            accessor: "universityName",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <GraduationCap size={14} className="text-indigo-400" />
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
                    {new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
            {/* Header */}
            <div className="relative z-10 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 mb-8 overflow-hidden backdrop-blur-xl transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-indigo-50 dark:bg-indigo-500/5 blur-3xl opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-emerald-50 dark:bg-emerald-500/5 blur-3xl opacity-60 pointer-events-none" />

                <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white shrink-0">
                            <Briefcase size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                My Cases
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium flex items-center gap-2">
                                Track and manage your cases
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {totalCount} Total
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search case type..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="w-full sm:w-40">
                                <select 
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-700 dark:text-slate-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5NDkzYjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-no-repeat bg-[position:right_12px_center] bg-[length:16px] pr-10 hover:border-indigo-500"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Completed">Completed</option>
                                </select>
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
                    <MyCasesEmptyState message="No cases found." />
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
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.4}}>
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