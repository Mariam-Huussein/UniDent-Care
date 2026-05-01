"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/common/StatCard";
import {
    Users,
    Clock,
    CheckCircle2,
    RefreshCw,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Filter,
    Hospital,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import {
    doctorDashboardService,
    DoctorStats,
    CaseRequest,
    PaginatedRequests,
} from "../services/doctorDashboardService";
import { containerVariants, itemVariants } from "@/lib/animations";
import Link from "next/link";

const STATUS_FILTERS = [
    { label: "All", labelAr: "الكل", value: undefined },
    { label: "Pending", labelAr: "معلق", value: 1 },
    { label: "Approved", labelAr: "مقبول", value: 2 },
    { label: "Rejected", labelAr: "مرفوض", value: 3 },
];

export default function DoctorDashboardScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const doctorId =
        (user as any)?.publicId ??
        (user as any)?.id ??
        Cookies.get("user_id");

    const [stats, setStats] = useState<DoctorStats | null>(null);
    const [requestsData, setRequestsData] = useState<PaginatedRequests | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [reqsLoading, setReqsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState<number | undefined>(undefined);
    const pageSize = 10;
    const searchRef = useRef<HTMLInputElement>(null);

    const fetchStats = async () => {
        if (!doctorId) return;
        try {
            setStatsLoading(true);
            const res = await doctorDashboardService.getDoctorDetails(doctorId);
            setStats(res);
        } catch (err) {
            console.error("Failed to fetch doctor stats:", err);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchRequests = useCallback(async (page = 1, status = activeStatus) => {
        try {
            setReqsLoading(true);
            const res = await doctorDashboardService.getDoctorRequests({
                page,
                pageSize,
                status,
                sortDirection: "desc",
            });
            setRequestsData(res);
        } catch (err) {
            console.error("Failed to fetch doctor requests:", err);
        } finally {
            setReqsLoading(false);
        }
    }, [activeStatus, pageSize]);

    useEffect(() => {
        fetchStats();
        fetchRequests(1, activeStatus);
    }, [doctorId]);

    const handleStatusFilter = (status: number | undefined) => {
        setActiveStatus(status);
        setCurrentPage(1);
        setSearchQuery("");
        fetchRequests(1, status);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchRequests(page, activeStatus);
    };

    const handleApprove = async (requestId: string) => {
        if (actionLoading) return;
        try {
            setActionLoading(requestId);
            await doctorDashboardService.approveRequest(requestId);
            await Promise.all([fetchStats(), fetchRequests(currentPage, activeStatus)]);
        } catch (err) {
            console.error("Failed to approve request:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId: string) => {
        if (actionLoading) return;
        try {
            setActionLoading(requestId);
            await doctorDashboardService.rejectRequest(requestId);
            await Promise.all([fetchStats(), fetchRequests(currentPage, activeStatus)]);
        } catch (err) {
            console.error("Failed to reject request:", err);
        } finally {
            setActionLoading(null);
        }
    };

    // Client-side search filter on top of server-side status filter
    const filteredItems = (requestsData?.items ?? []).filter((req) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            req.patientName?.toLowerCase().includes(q) ||
            req.studentName?.toLowerCase().includes(q) ||
            req.caseName?.toLowerCase().includes(q)
        );
    });

    const statItems = [
        {
            label: isRtl ? "إجمالي المرضى" : "Total Patients",
            value: stats?.totalStudents ?? 0,
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
        },
        {
            label: isRtl ? "طلبات معلقة" : "Pending Requests",
            value: stats?.pendingRequests ?? 0,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: isRtl ? "طلبات مقبولة" : "Approved Requests",
            value: stats?.approvedRequests ?? 0,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        },
    ];

    const getStatusBadge = (status: string) => {
        const base = "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold";
        if (status === "Pending")   return `${base} bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-300`;
        if (status === "Approved")  return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300`;
        if (status === "Rejected")  return `${base} bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-300`;
        return `${base} bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300`;
    };

    const firstName =
        (user as any)?.fullName?.split(" ")[0] ||
        stats?.fullName?.split(" ")[0] ||
        (isRtl ? "دكتور" : "Doctor");

    return (
        <motion.div
            className="space-y-8 max-w-[1400px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            dir={isRtl ? "rtl" : "ltr"}
        >
            {/* ── Header ── */}
            <motion.div variants={itemVariants} className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                    {isRtl
                        ? `أهلاً بك مجدداً ${firstName}! 👋`
                        : `Welcome back, ${firstName}! 👋`}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isRtl
                        ? "إليك نظرة سريعة على إحصائياتك وطلبات الحالات."
                        : "Here's a quick look at your stats and case requests."}
                </p>
            </motion.div>

            {/* ── Stats Cards ── */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-1 transition-colors duration-300"
            >
                {statItems.map((item, i) => (
                    <StatCard
                        key={i}
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                        color={item.color}
                        bgColor={item.bgColor}
                        loading={statsLoading}
                    />
                ))}
            </motion.div>

            {/* ── Case Requests Panel ── */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300"
            >
                {/* Panel header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* Title */}
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                {isRtl ? "طلبات الحالات" : "Case Requests"}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {isRtl
                                    ? "إدارة ومراجعة طلبات الطلاب"
                                    : "Manage and review student case requests"}
                            </p>
                        </div>

                        {/* Search + Refresh */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Search bar */}
                            <div className="relative flex-1 min-w-[200px] max-w-sm">
                                <Search
                                    size={15}
                                    className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    style={{ [isRtl ? "right" : "left"]: "12px" }}
                                />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={
                                        isRtl
                                            ? "ابحث بالمريض أو الطالب أو الحالة..."
                                            : "Search patient, student or case..."
                                    }
                                    className={`w-full h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all ${isRtl ? "pr-9 pl-9" : "pl-9 pr-9"}`}
                                />
                                <AnimatePresence>
                                    {searchQuery && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.7 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={() => setSearchQuery("")}
                                            className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                            style={{ [isRtl ? "left" : "right"]: "10px" }}
                                        >
                                            <X size={14} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Refresh */}
                            <button
                                onClick={() => { fetchStats(); fetchRequests(currentPage, activeStatus); }}
                                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title={isRtl ? "تحديث" : "Refresh"}
                            >
                                <RefreshCw size={16} className={reqsLoading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* Status filter chips */}
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <Filter size={13} className="text-slate-400 shrink-0" />
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={String(f.value)}
                                onClick={() => handleStatusFilter(f.value)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                                    activeStatus === f.value
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-indigo-900"
                                        : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400"
                                }`}
                            >
                                {isRtl ? f.labelAr : f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm" dir={isRtl ? "rtl" : "ltr"}>
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                <th className="px-6 py-3 text-left">{isRtl ? "الحالة" : "Case"}</th>
                                <th className="px-6 py-3 text-left">{isRtl ? "المريض" : "Patient"}</th>
                                <th className="px-6 py-3 text-left">{isRtl ? "الطالب" : "Student"}</th>
                                <th className="px-6 py-3 text-left">{isRtl ? "الجامعة" : "University"}</th>
                                <th className="px-6 py-3 text-left">{isRtl ? "المستوى" : "Level"}</th>
                                <th className="px-6 py-3 text-left">{isRtl ? "الحالة" : "Status"}</th>
                                <th className="px-6 py-3 text-right">{isRtl ? "الإجراءات" : "Actions"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {reqsLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <Search size={24} className="text-slate-300 dark:text-slate-600" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                                                {searchQuery
                                                    ? (isRtl ? "لا توجد نتائج للبحث" : "No results match your search")
                                                    : (isRtl ? "لا توجد طلبات حالات" : "No case requests found")}
                                            </p>
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery("")}
                                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    {isRtl ? "مسح البحث" : "Clear search"}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((req: CaseRequest) => (
                                    <motion.tr
                                        key={req.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        {/* Case Name (Primary Link) */}
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                            <Link
                                                href={`/cases/${req.patientCasePublicId}`}
                                                className="group/link flex items-center gap-2.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs shrink-0 group-hover/link:scale-110 transition-all duration-300">
                                                    {(req.caseName || "C")[0].toUpperCase()}
                                                </div>
                                                <span className="group-hover/link:underline underline-offset-4 decoration-2">
                                                    {req.caseName}
                                                </span>
                                            </Link>
                                        </td>

                                        {/* Patient */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                                                <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                    {req.patientName || (isRtl ? "مريض غير معروف" : "Unknown Patient")}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Student */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">{req.studentName}</p>
                                        </td>

                                        {/* University */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Hospital size={14} className="text-slate-400" />
                                                <span className="text-slate-600 dark:text-slate-300 font-medium">{req.university}</span>
                                            </div>
                                        </td>

                                        {/* Level */}
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                                            {isRtl ? `المستوى ${req.level}` : `Level ${req.level}`}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadge(req.status)}>
                                                {req.status === "Pending" && <Clock size={10} />}
                                                {req.status === "Approved" && <CheckCircle2 size={10} />}
                                                {req.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {actionLoading === req.id
                                                                ? <RefreshCw size={11} className="animate-spin" />
                                                                : <CheckCircle2 size={11} />}
                                                            {isRtl ? "قبول" : "Approve"}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isRtl ? "رفض" : "Reject"}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {requestsData && requestsData.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                            {isRtl
                                ? `صفحة ${requestsData.currentPage} من ${requestsData.totalPages} · ${requestsData.totalCount} طلب`
                                : `Page ${requestsData.currentPage} of ${requestsData.totalPages} · ${requestsData.totalCount} total`}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!requestsData.hasPreviousPage}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                                {isRtl ? "السابق" : "Prev"}
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!requestsData.hasNextPage}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isRtl ? "التالي" : "Next"}
                                {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
