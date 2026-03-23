"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
    ClipboardClock,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ChevronLeft,
    User,
    GraduationCap,
    Hospital,
    FileText,
    X,
    RefreshCw,
    ClipboardList,
    Calendar,
    Stethoscope,
    BookOpen,
    Info,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import { doctorDashboardService, CaseRequest, PaginatedRequests } from "@/features/dashboard/services/doctorDashboardService";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return {
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200/50 dark:border-emerald-800/50",
                bar: "bg-emerald-400",
                icon: <CheckCircle2 size={13} />,
            };
        case "rejected":
            return {
                bg: "bg-red-100 dark:bg-red-900/30",
                text: "text-red-700 dark:text-red-400",
                border: "border-red-200/50 dark:border-red-800/50",
                bar: "bg-red-400",
                icon: <XCircle size={13} />,
            };
        default:
            return {
                bg: "bg-amber-100 dark:bg-amber-900/30",
                text: "text-amber-700 dark:text-amber-400",
                border: "border-amber-200/50 dark:border-amber-800/50",
                bar: "bg-amber-400",
                icon: <Clock size={13} />,
            };
    }
};

type DetailRow = { icon: React.ReactNode; label: string; value: string | number };

export default function PendingCasesPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const doctorId =
        (user as any)?.publicId ??
        (user as any)?.id ??
        Cookies.get("user_id");

    const [requests, setRequests] = useState<CaseRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<CaseRequest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Omit<PaginatedRequests, "items"> | null>(null);
    const pageSize = 12;

    const fetchRequests = async (page = currentPage) => {
        if (!doctorId) return;
        try {
            setLoading(true);
            const res = await doctorDashboardService.getCaseRequestsByDoctor(doctorId, page, pageSize);
            setRequests(res.items);
            setPagination({
                totalCount: res.totalCount,
                currentPage: res.currentPage,
                totalPages: res.totalPages,
                hasPreviousPage: res.hasPreviousPage,
                hasNextPage: res.hasNextPage,
            });
        } catch (err) {
            console.error("Failed to fetch requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(1);
    }, [doctorId]);

    const applyStatusUpdate = (requestId: string, newStatus: string) => {
        setRequests((prev) =>
            prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
        );
        setSelectedRequest((prev) =>
            prev?.id === requestId ? { ...prev, status: newStatus } : prev
        );
    };

    const handleApprove = async (requestId: string) => {
        if (actionLoading) return;
        try {
            setActionLoading(requestId);
            await doctorDashboardService.approveRequest(requestId);
            applyStatusUpdate(requestId, "Approved");
            await fetchRequests(currentPage);
        } catch (err) {
            console.error("Failed to approve:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId: string) => {
        if (actionLoading) return;
        try {
            setActionLoading(requestId);
            await doctorDashboardService.rejectRequest(requestId);
            applyStatusUpdate(requestId, "Rejected");
            await fetchRequests(currentPage);
        } catch (err) {
            console.error("Failed to reject:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchRequests(page);
    };

    const buildDetailRows = (req: CaseRequest): DetailRow[] => [
        { icon: <FileText size={15} />, label: "Case Name", value: req.caseName },
        { icon: <User size={15} />, label: "Patient Name", value: req.patientName || "N/A" },
        { icon: <GraduationCap size={15} />, label: "Student Name", value: req.studentName },
        { icon: <BookOpen size={15} />, label: "Student ID", value: req.studentPublicId },
        { icon: <Hospital size={15} />, label: "University", value: req.university },
        { icon: <Info size={15} />, label: "Level", value: req.level },
        { icon: <Stethoscope size={15} />, label: "Doctor Name", value: req.doctorName },
        { icon: <Calendar size={15} />, label: "Submitted On", value: new Date(req.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6" dir={isRtl ? "rtl" : "ltr"}>
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                        <ClipboardClock size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                            Pending Cases
                        </h1>
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                            {pagination ? `${pagination.totalCount} total requests` : "Review and manage incoming case requests"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => fetchRequests(currentPage)}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse"
                        />
                    ))}
                </div>
            ) : requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                        <ClipboardList size={40} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-lg font-bold text-slate-500 dark:text-slate-400">No case requests found</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        When students submit requests, they will appear here.
                    </p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {requests.map((req) => {
                        const status = getStatusStyles(req.status);
                        return (
                            <motion.div
                                key={req.id}
                                variants={cardVariants}
                                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Accent bar */}
                                <div className={`h-1 w-full ${status.bar}`} />

                                <div className="p-5 flex flex-col gap-4 flex-1">
                                    {/* Case name + status */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-black text-slate-800 dark:text-white text-base leading-tight flex-1">
                                            {req.caseName}
                                        </h3>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${status.bg} ${status.text} ${status.border}`}>
                                            {status.icon}
                                            {req.status}
                                        </span>
                                    </div>

                                    {/* All visible fields on the card */}
                                    <div className="space-y-2">
                                        <InfoRow icon={<User size={13} />} label="Patient" value={req.patientName || "N/A"} />
                                        <InfoRow icon={<GraduationCap size={13} />} label="Student" value={req.studentName} />
                                        <InfoRow icon={<Hospital size={13} />} label="University" value={req.university} />
                                        <InfoRow icon={<Info size={13} />} label="Level" value={String(req.level)} />
                                        <InfoRow icon={<Stethoscope size={13} />} label="Doctor" value={req.doctorName} />
                                        {req.description && (
                                            <InfoRow icon={<FileText size={13} />} label="Description" value={req.description} truncate />
                                        )}
                                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs pt-0.5">
                                            <Calendar size={11} className="shrink-0" />
                                            <span>{new Date(req.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                                        {req.status === "Pending" ? (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    disabled={actionLoading === req.id}
                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === req.id ? <RefreshCw size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    disabled={actionLoading === req.id}
                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors disabled:opacity-50"
                                                >
                                                    {actionLoading === req.id ? <RefreshCw size={11} className="animate-spin" /> : <XCircle size={11} />}
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex-1" />
                                        )}
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all"
                                        >
                                            Full Details
                                            {isRtl ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                        Page {pagination.currentPage} of {pagination.totalPages} &nbsp;·&nbsp; {pagination.totalCount} total
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPreviousPage}
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedRequest(null)}
                        />

                        <motion.div
                            className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between rounded-t-3xl z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                        <FileText size={18} />
                                    </div>
                                    <h2 className="text-lg font-black text-slate-800 dark:text-white">
                                        Full Request Details
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-5">
                                {/* Status + Date */}
                                <div className="flex items-center justify-between">
                                    {(() => {
                                        const s = getStatusStyles(selectedRequest.status);
                                        return (
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${s.bg} ${s.text} ${s.border}`}>
                                                {s.icon}
                                                {selectedRequest.status}
                                            </span>
                                        );
                                    })()}
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                        <Calendar size={11} />
                                        {new Date(selectedRequest.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                    </span>
                                </div>

                                {/* Description (full) */}
                                {selectedRequest.description && (
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Description</p>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                            {selectedRequest.description}
                                        </p>
                                    </div>
                                )}

                                {/* All detail rows */}
                                <div className="grid grid-cols-1 gap-3">
                                    {buildDetailRows(selectedRequest).map((row, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                            <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0">{row.icon}</span>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{row.label}</p>
                                                <p className="text-slate-800 dark:text-white font-semibold text-sm mt-0.5 break-all">{row.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action buttons */}
                                {selectedRequest.status === "Pending" && (
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => handleApprove(selectedRequest.id)}
                                            disabled={actionLoading === selectedRequest.id}
                                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition-colors disabled:opacity-60 shadow-lg shadow-emerald-500/25"
                                        >
                                            {actionLoading === selectedRequest.id ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                                            Approve Request
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedRequest.id)}
                                            disabled={actionLoading === selectedRequest.id}
                                            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white transition-colors disabled:opacity-60 shadow-lg shadow-red-500/25"
                                        >
                                            {actionLoading === selectedRequest.id ? <RefreshCw size={15} className="animate-spin" /> : <XCircle size={15} />}
                                            Reject Request
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* Small helper component for info rows */
function InfoRow({ icon, label, value, truncate = false }: { icon: React.ReactNode; label: string; value: string; truncate?: boolean }) {
    return (
        <div className="flex items-start gap-2 text-sm">
            <span className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">{icon}</span>
            <span className="text-slate-400 dark:text-slate-500 font-semibold shrink-0">{label}:</span>
            <span className={`text-slate-700 dark:text-slate-200 font-semibold ${truncate ? "truncate" : ""}`}>{value}</span>
        </div>
    );
}