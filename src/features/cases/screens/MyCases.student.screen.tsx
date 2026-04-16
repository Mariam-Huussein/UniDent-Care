"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Briefcase, Send, Stethoscope, GraduationCap, Calendar,
    ChevronLeft, ChevronRight, Search, Filter, Clock,
    CheckCircle, AlertCircle, XCircle, Activity, User,
    ArrowRight, BookOpen, Loader2,
} from "lucide-react";
import { useMyCasesStudent } from "../hooks/useMyCasesStudent";
import { StudentCaseItem, StudentRequestItem } from "../types/caseCardProps.types";

/* ── Status helpers ── */
function getCaseStatusConfig(status: string) {
    const s = status?.toLowerCase();
    if (s === "in-progress" || s === "inprogress")
        return { label: "In Progress", dot: "bg-amber-400", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Activity };
    if (s === "completed")
        return { label: "Completed", dot: "bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle };
    if (s === "diagnosis")
        return { label: "Diagnosis", dot: "bg-blue-400", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20", icon: Stethoscope };
    return { label: "Unassigned", dot: "bg-slate-400", text: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800/60", icon: AlertCircle };
}

function getRequestStatusConfig(status: string) {
    const s = status?.toLowerCase();
    if (s === "approved")
        return { label: "Approved", dot: "bg-emerald-400", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" };
    if (s === "rejected")
        return { label: "Rejected", dot: "bg-red-400", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" };
    return { label: "Pending", dot: "bg-amber-400", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20" };
}

/* ── Skeleton ── */
function CardSkeleton() {
    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 space-y-3 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                    <div className="h-2.5 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
            <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
    );
}

/* ── Empty State ── */
function EmptyState({ message }: { message: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-slate-400" />
            </div>
            <p className="text-base font-semibold text-slate-600 dark:text-slate-300">{message}</p>
            <p className="text-sm text-slate-400 mt-1">Check back later or explore available cases.</p>
        </div>
    );
}

/* ── Pagination ── */
function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p === page ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                >
                    {p}
                </button>
            ))}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

/* ── Case Card ── */
function CaseCard({ item, index }: { item: StudentCaseItem; index: number }) {
    const sc = getCaseStatusConfig(item.status);
    const StatusIcon = sc.icon;
    const initials = item.patientName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link href={`/cases/${item.id}`} className="group block h-full">
                <div className="h-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 space-y-4 hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-lg hover:shadow-indigo-50 dark:hover:shadow-indigo-900/10 transition-all duration-300">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/30">
                                <span className="text-white font-bold text-sm">{initials}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {item.patientName}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {item.diagnosisdto?.caseType || "Unknown type"}
                                </p>
                            </div>
                        </div>
                        {/* Status Badge */}
                        <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                            {sc.label}
                        </span>
                    </div>

                    {/* Meta chips */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-2.5 py-1.5">
                            <User size={11} className="text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">{item.patientAge}y old</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-2.5 py-1.5">
                            <Stethoscope size={11} className="text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">{item.totalSessions} sessions</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-2.5 py-1.5">
                            <GraduationCap size={11} className="text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">{item.universityName || "—"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-2.5 py-1.5">
                            <Calendar size={11} className="text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate">{new Date(item.createAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Process status pill */}
                    {item.processStatus && (
                        <div className="flex items-center gap-1.5">
                            <StatusIcon size={12} className={sc.text} />
                            <span className={`text-[11px] font-medium ${sc.text}`}>{item.processStatus}</span>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center justify-end">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 group-hover:gap-2 transition-all">
                            View Details <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

/* ── Request Card ── */
function RequestCard({ item, index }: { item: StudentRequestItem; index: number }) {
    const sc = getRequestStatusConfig(item.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 space-y-3 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all duration-300"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.patientName}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{item.caseName || "—"}</p>
                </div>
                <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} uppercase tracking-wider`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                </span>
            </div>

            {/* Doctor */}
            {item.doctorName && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <Stethoscope size={11} className="text-slate-400" />
                    <span>To Dr. <span className="font-semibold text-slate-700 dark:text-slate-300">{item.doctorName}</span></span>
                </div>
            )}

            {/* Description */}
            {item.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 border-l-2 border-slate-200 dark:border-slate-700 pl-2.5 italic">
                    {item.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <Clock size={10} />
                    {new Date(item.createAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
                <Link
                    href={`/cases/${item.patientCasePublicId}`}
                    className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                    View Case <ArrowRight size={11} />
                </Link>
            </div>
        </motion.div>
    );
}

/* ══════════════════════════════════════════
   Main Screen
══════════════════════════════════════════ */
export default function MyCasesStudentScreen() {
    const {
        activeTab, setActiveTab,
        cases, casesLoading, caseType, setCaseType, casesPage, setCasesPage, casesTotalPages, casesTotalCount,
        requests, requestsLoading, requestStatus, setRequestStatus, requestsPage, setRequestsPage, requestsTotalPages, requestsTotalCount,
    } = useMyCasesStudent();

    const CASE_TYPES = ["Restorative", "Orthodontic", "Surgical", "Endodontic", "Periodontic", "Prosthodontic"];
    const REQUEST_STATUSES = ["Pending", "Approved", "Rejected"];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">

            {/* ── Header ── */}
            <div className="mb-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            My Cases
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Track your assigned cases and pending requests
                        </p>
                    </div>
                    {/* Summary pills */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-2 shadow-sm">
                            <Briefcase size={14} className="text-indigo-500" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{casesTotalCount}</span>
                            <span className="text-xs text-slate-400">cases</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-2 shadow-sm">
                            <Send size={14} className="text-amber-500" />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{requestsTotalCount}</span>
                            <span className="text-xs text-slate-400">requests</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mt-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-1 w-fit shadow-sm">
                    {[
                        { id: "cases", label: "My Cases", icon: Briefcase, count: casesTotalCount },
                        { id: "requests", label: "My Requests", icon: Send, count: requestsTotalCount },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/50" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">

                {/* ══ CASES TAB ══ */}
                {activeTab === "cases" && (
                    <motion.div
                        key="cases"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Filter bar */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
                                <Filter size={13} className="text-slate-400 shrink-0" />
                                <select
                                    value={caseType}
                                    onChange={(e) => { setCaseType(e.target.value); setCasesPage(1); }}
                                    className="text-sm text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer min-w-[140px]"
                                >
                                    <option value="">All Case Types</option>
                                    {CASE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            {casesLoading && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {casesLoading ? (
                                Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                            ) : cases.length === 0 ? (
                                <EmptyState message="No cases assigned to you yet." />
                            ) : (
                                cases.map((item, i) => <CaseCard key={item.id} item={item} index={i} />)
                            )}
                        </div>

                        <Pagination page={casesPage} totalPages={casesTotalPages} onPageChange={setCasesPage} />
                    </motion.div>
                )}

                {/* ══ REQUESTS TAB ══ */}
                {activeTab === "requests" && (
                    <motion.div
                        key="requests"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Filter bar */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm">
                                <Search size={13} className="text-slate-400 shrink-0" />
                                <select
                                    value={requestStatus}
                                    onChange={(e) => { setRequestStatus(e.target.value); setRequestsPage(1); }}
                                    className="text-sm text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer min-w-[140px]"
                                >
                                    <option value="">All Statuses</option>
                                    {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            {requestsLoading && <Loader2 size={16} className="animate-spin text-indigo-500" />}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {requestsLoading ? (
                                Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                            ) : requests.length === 0 ? (
                                <EmptyState message="No requests sent yet." />
                            ) : (
                                requests.map((item, i) => <RequestCard key={item.id} item={item} index={i} />)
                            )}
                        </div>

                        <Pagination page={requestsPage} totalPages={requestsTotalPages} onPageChange={setRequestsPage} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}