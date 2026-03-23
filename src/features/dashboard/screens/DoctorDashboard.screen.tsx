"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, Variants } from "framer-motion";
import { StatCard } from "@/components/common/StatCard";
import { Users, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import {
    doctorDashboardService,
    DoctorStats,
    CaseRequest,
    PaginatedRequests,
} from "../services/doctorDashboardService";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

export default function DoctorDashboardScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { language } = useLanguage();
    const isRtl = language === "ar";

    // Resolve the doctor's ID from Redux or cookie fallback
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
    const pageSize = 10;

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

    const fetchRequests = async (page = currentPage) => {
        try {
            setReqsLoading(true);
            const res = await doctorDashboardService.getDoctorRequests(page, pageSize);
            setRequestsData(res);
        } catch (err) {
            console.error("Failed to fetch doctor requests:", err);
        } finally {
            setReqsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchRequests(1);
    }, [doctorId]);

    const handleApprove = async (requestId: string) => {
        if (actionLoading) return;
        try {
            setActionLoading(requestId);
            await doctorDashboardService.approveRequest(requestId);
            await Promise.all([fetchStats(), fetchRequests(currentPage)]);
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
            await Promise.all([fetchStats(), fetchRequests(currentPage)]);
        } catch (err) {
            console.error("Failed to reject request:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchRequests(page);
    };

    const statItems = [
        {
            label: "Total Students",
            value: stats?.totalStudents ?? 0,
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-900/30",
        },
        {
            label: "Pending Requests",
            value: stats?.pendingRequests ?? 0,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-50 dark:bg-amber-900/30",
        },
        {
            label: "Approved Requests",
            value: stats?.approvedRequests ?? 0,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
        },
    ];

    const getStatusBadge = (status: string) => {
        const base = "px-2.5 py-0.5 rounded-full text-xs font-semibold";
        if (status === "Pending") return `${base} bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300`;
        if (status === "Approved") return `${base} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300`;
        if (status === "Rejected") return `${base} bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300`;
        return `${base} bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300`;
    };

    return (
        <motion.div
            className="p-6 space-y-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            dir={isRtl ? "rtl" : "ltr"}
        >
            {/* Stats Cards */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1 transition-colors duration-300"
            >
                {statItems.map((item, index) => (
                    <StatCard
                        key={index}
                        label={item.label}
                        value={item.value}
                        icon={item.icon}
                        color={item.color}
                        bgColor={item.bgColor}
                        loading={statsLoading}
                    />
                ))}
            </motion.div>

            {/* Case Requests Table */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300"
            >
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                        Case Requests
                    </h2>
                    <button
                        onClick={() => { fetchStats(); fetchRequests(currentPage); }}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={16} className={reqsLoading ? "animate-spin" : ""} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm" dir={isRtl ? "rtl" : "ltr"}>
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                <th className="px-6 py-3 text-left">Patient</th>
                                <th className="px-6 py-3 text-left">Case</th>
                                <th className="px-6 py-3 text-left">Student</th>
                                <th className="px-6 py-3 text-left">Level</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
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
                            ) : !requestsData?.items?.length ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-slate-400 dark:text-slate-500"
                                    >
                                        No case requests found.
                                    </td>
                                </tr>
                            ) : (
                                requestsData.items.map((req: CaseRequest) => (
                                    <tr
                                        key={req.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {req.patientName || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {req.caseName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-slate-700 dark:text-slate-200">
                                                {req.studentName}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                                {req.university}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                            {req.level}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={getStatusBadge(req.status)}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {req.status === "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {actionLoading === req.id ? (
                                                                <RefreshCw size={12} className="animate-spin" />
                                                            ) : (
                                                                <CheckCircle2 size={12} />
                                                            )}
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(req.id)}
                                                            disabled={actionLoading === req.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {actionLoading === req.id ? (
                                                                <RefreshCw size={12} className="animate-spin" />
                                                            ) : null}
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {requestsData && requestsData.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">
                            Page {requestsData.currentPage} of {requestsData.totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!requestsData.hasPreviousPage}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!requestsData.hasNextPage}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
