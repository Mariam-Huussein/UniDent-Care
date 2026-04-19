"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    ChevronLeft,
    User,
    Calendar,
    Stethoscope,
    FileText,
    Search,
    RefreshCw,
    X,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import { studentDashboardService } from "@/features/dashboard/services/studentDashboardService";
import { CaseRequest, PaginatedRequests } from "@/features/dashboard/services/doctorDashboardService";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return {
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                text: "text-emerald-600 dark:text-emerald-400",
                border: "border-emerald-100 dark:border-emerald-800/50",
                icon: <CheckCircle2 size={14} />,
            };
        case "rejected":
            return {
                bg: "bg-red-50 dark:bg-red-900/20",
                text: "text-red-600 dark:text-red-400",
                border: "border-red-100 dark:border-red-800/50",
                icon: <XCircle size={14} />,
            };
        default:
            return {
                bg: "bg-amber-50 dark:bg-amber-900/20",
                text: "text-amber-600 dark:text-amber-400",
                border: "border-amber-100 dark:border-amber-800/50",
                icon: <Clock size={14} />,
            };
    }
};

export default function MyCasesStudentScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const studentId =
        (user as any)?.publicId ??
        (user as any)?.id ??
        Cookies.get("user_id");

    const [requests, setRequests] = useState<CaseRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<CaseRequest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Omit<PaginatedRequests, "items"> | null>(null);
    const pageSize = 9;

    const fetchRequests = async (page = currentPage) => {
        if (!studentId) return;
        try {
            setLoading(true);
            const res = await studentDashboardService.getCaseRequests(studentId, page, pageSize);
            setRequests(res.items);
            setPagination({
                totalCount: res.totalCount,
                currentPage: res.currentPage,
                totalPages: res.totalPages,
                hasPreviousPage: res.hasPreviousPage,
                hasNextPage: res.hasNextPage,
            });
        } catch (err) {
            console.error("Failed to fetch student requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(1);
    }, [studentId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchRequests(page);
    };

    return (
        <div className="min-h-[80vh] flex flex-col gap-8 p-4 md:p-8" dir={isRtl ? "rtl" : "ltr"}>
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30">
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                            My Case Requests
                        </h1>
                        <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">
                            {pagination?.totalCount ?? 0} total requests submitted
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchRequests(currentPage)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Content grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-800" />
                    ))}
                </div>
            ) : requests.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                        <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">No requests found</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">
                        You haven't submitted any case requests yet. Find a case and submit a request to see it here.
                    </p>
                </div>
            ) : (
                <>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {requests.map((req) => {
                            const statusStyles = getStatusStyles(req.status);
                            return (
                                <motion.div
                                    key={req.id}
                                    variants={cardVariants}
                                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all group flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-3 py-1.2 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
                                            {statusStyles.icon}
                                            {req.status}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                            <Calendar size={13} />
                                            {new Date(req.createAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-black text-slate-800 dark:text-white line-clamp-1 mb-1">
                                        {req.caseName}
                                    </h4>
                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-5">
                                        <User size={14} />
                                        {req.patientName}
                                    </div>

                                    <div className="space-y-3 mb-6 flex-1">
                                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                                            <Stethoscope size={16} className="text-indigo-500" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-bold">Assigned Doctor</span>
                                                <span className="text-slate-700 dark:text-slate-200 font-bold">{req.doctorName || "Pending Assign"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedRequest(req)}
                                        className="w-full py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white font-bold text-sm hover:border-indigo-600 dark:hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
                                    >
                                        Full Details
                                        <ChevronRight size={16} />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-slate-400 text-sm font-medium">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRequest(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <FileText size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 dark:text-white">Request Details</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <DetailBox label="Patient" value={selectedRequest.patientName} icon={<User size={16} />} />
                                        <DetailBox label="Status" value={selectedRequest.status} icon={<Clock size={16} />} isStatus />
                                    </div>
                                    
                                    <DetailBox label="Case Name" value={selectedRequest.caseName} icon={<Briefcase size={16} />} full />
                                    <DetailBox label="Assigned Doctor" value={selectedRequest.doctorName || "Not assigned yet"} icon={<Stethoscope size={16} />} full />
                                    
                                    {selectedRequest.description && (
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Request Description</span>
                                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border border-slate-100 dark:border-slate-800">
                                                {selectedRequest.description}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Submitted On</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-bold">{new Date(selectedRequest.createAt).toLocaleDateString(undefined, { dateStyle: "long" })}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-8 pt-0">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black shadow-xl shadow-slate-200 dark:shadow-none hover:opacity-90 transition-all active:scale-[0.98]"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function DetailBox({ label, value, icon, full = false, isStatus = false }: { label: string; value: string; icon: React.ReactNode; full?: boolean; isStatus?: boolean }) {
    return (
        <div className={`flex flex-col gap-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 ${full ? "col-span-2" : ""}`}>
            <div className="flex items-center gap-2 text-indigo-500">
                {icon}
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">{label}</span>
            </div>
            <span className={`font-bold text-slate-800 dark:text-white truncate ${isStatus ? "text-indigo-600 dark:text-indigo-400" : ""}`}>{value}</span>
        </div>
    );
}