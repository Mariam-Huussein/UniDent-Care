"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
    Search,
    Filter,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import { doctorDashboardService, CaseRequest, PaginatedRequests } from "@/features/dashboard/services/doctorDashboardService";
import { containerVariants, itemVariants } from "@/lib/animations";
import Link from "next/link";

const STATUS_FILTERS = [
    { label: "All", labelAr: "الكل", value: undefined },
    { label: "Pending", labelAr: "معلق", value: 1 },
    { label: "Approved", labelAr: "مقبول", value: 2 },
    { label: "Rejected", labelAr: "مرفوض", value: 3 },
];

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

export default function PendingRequestsPage() {
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
    const [searchQuery, setSearchQuery] = useState("");
    const [activeStatus, setActiveStatus] = useState<number | undefined>(undefined);
    const pageSize = 12;
    const searchRef = useRef<HTMLInputElement>(null);

    const fetchRequests = useCallback(async (page = currentPage, status = activeStatus) => {
        if (!doctorId) return;
        try {
            setLoading(true);
            const res = await doctorDashboardService.getDoctorRequests({
                page,
                pageSize,
                status,
                sortDirection: "desc",
            });
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
    }, [doctorId, currentPage, activeStatus]);

    useEffect(() => {
        fetchRequests(1, activeStatus);
    }, [doctorId, activeStatus, fetchRequests]);

    const handleStatusFilter = (status: number | undefined) => {
        setActiveStatus(status);
        setCurrentPage(1);
        setSearchQuery("");
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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

    const buildDetailRows = (req: CaseRequest): DetailRow[] => [
        { icon: <FileText size={15} />, label: isRtl ? "اسم الحالة" : "Case Name", value: req.caseName },
        { icon: <User size={15} />, label: isRtl ? "اسم المريض" : "Patient Name", value: req.patientName || "N/A" },
        { icon: <GraduationCap size={15} />, label: isRtl ? "اسم الطالب" : "Student Name", value: req.studentName },
        { icon: <BookOpen size={15} />, label: isRtl ? "رقم الطالب" : "Student ID", value: req.studentPublicId },
        { icon: <Hospital size={15} />, label: isRtl ? "الجامعة" : "University", value: req.university },
        { icon: <Info size={15} />, label: isRtl ? "المستوى" : "Level", value: req.level },
        { icon: <Stethoscope size={15} />, label: isRtl ? "اسم الدكتور" : "Doctor Name", value: req.doctorName },
        { icon: <Calendar size={15} />, label: isRtl ? "تاريخ التقديم" : "Submitted On", value: new Date(req.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) },
    ];

    const filteredRequests = requests.filter((req) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            req.patientName?.toLowerCase().includes(q) ||
            req.studentName?.toLowerCase().includes(q) ||
            req.caseName?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden pb-20">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 dark:bg-amber-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            <motion.div
                className="relative p-6 space-y-8 max-w-[1600px] mx-auto w-full"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                dir={isRtl ? "rtl" : "ltr"}
            >
                {/* Page Header */}
                <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400 shadow-sm">
                            <ClipboardClock size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 dark:text-white">
                                {isRtl ? "طلبات الحالات" : "Case Requests"}
                            </h1>
                            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">
                                {pagination 
                                    ? (isRtl ? `${pagination.totalCount} طلب إجمالي` : `${pagination.totalCount} total requests`)
                                    : (isRtl ? "مراجعة وإدارة طلبات الحالات الواردة" : "Review and manage incoming case requests")}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        {/* Search bar */}
                        <div className="relative flex-1 min-w-[280px] max-w-md">
                            <Search
                                size={18}
                                className="absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                style={{ [isRtl ? "right" : "left"]: "16px" }}
                            />
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={isRtl ? "ابحث بالمريض، الطالب أو الحالة..." : "Search patient, student or case..."}
                                className={`w-full h-12 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 backdrop-blur-md transition-all ${isRtl ? "pr-12 pl-12" : "pl-12 pr-12"}`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    style={{ [isRtl ? "left" : "right"]: "16px" }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => fetchRequests(currentPage)}
                            className="p-3.5 rounded-2xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-all duration-300 active:scale-95 shadow-sm group bg-white/50 dark:bg-slate-900/50 backdrop-blur-md"
                            title="Refresh"
                        >
                            <RefreshCw size={20} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
                        </button>
                    </div>
                </motion.header>

                {/* Filters Row */}
                <motion.div variants={itemVariants} className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
                    <Filter size={16} className="text-slate-400 shrink-0 mx-2" />
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={String(f.value)}
                            onClick={() => handleStatusFilter(f.value)}
                            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-300 shrink-0 ${
                                activeStatus === f.value
                                    ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20"
                                    : "bg-white/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700"
                            }`}
                        >
                            {isRtl ? f.labelAr : f.label}
                        </button>
                    ))}
                </motion.div>

                {/* Cards Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-80 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-32 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-300 dark:text-slate-600">
                            {searchQuery ? <Search size={48} /> : <ClipboardList size={48} />}
                        </div>
                        <p className="text-xl font-black text-slate-500 dark:text-slate-400">
                            {searchQuery ? (isRtl ? "لا توجد نتائج للبحث" : "No search results found") : (isRtl ? "لا توجد طلبات حالات" : "No case requests found")}
                        </p>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-2">
                            {searchQuery ? (isRtl ? "حاول البحث بكلمات أخرى" : "Try searching with different terms") : (isRtl ? "عندما يرسل الطلاب طلبات، ستظهر هنا." : "When students submit requests, they will appear here.")}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                    >
                        {filteredRequests.map((req) => {
                            const status = getStatusStyles(req.status);
                            return (
                                <motion.div
                                    key={req.id}
                                    variants={cardVariants}
                                    className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 dark:hover:shadow-amber-900/20 hover:border-amber-200 dark:hover:border-amber-800 transition-all duration-500 overflow-hidden flex flex-col"
                                >
                                    {/* Accent bar */}
                                    <div className={`h-1.5 w-full ${status.bar}`} />

                                    <div className="p-7 flex flex-col gap-5 flex-1">
                                        {/* Case name + status */}
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="font-black text-slate-800 dark:text-white text-lg leading-tight flex-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {req.caseName}
                                            </h3>
                                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${status.bg} ${status.text} ${status.border} shadow-sm`}>
                                                {status.icon}
                                                {req.status}
                                            </span>
                                        </div>

                                        {/* Info Fields */}
                                        <div className="space-y-3">
                                            <InfoRow icon={<User size={14} />} label={isRtl ? "المريض" : "Patient"} value={req.patientName || "N/A"} />
                                            <InfoRow icon={<GraduationCap size={14} />} label={isRtl ? "الطالب" : "Student"} value={req.studentName} />
                                            <InfoRow icon={<Hospital size={14} />} label={isRtl ? "الجامعة" : "University"} value={req.university} />
                                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] font-bold pt-1">
                                                <Calendar size={12} className="shrink-0" />
                                                <span className="uppercase tracking-tighter">
                                                    {new Date(req.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-auto pt-5 border-t border-slate-50 dark:border-slate-800/60 flex flex-col gap-3">
                                            {req.status === "Pending" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); handleApprove(req.id); }}
                                                        disabled={actionLoading === req.id}
                                                        className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 rounded-xl text-[11px] font-black bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        {actionLoading === req.id ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                        {isRtl ? "موافقة" : "Approve"}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); handleReject(req.id); }}
                                                        disabled={actionLoading === req.id}
                                                        className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30 transition-all active:scale-95"
                                                        title={isRtl ? "رفض" : "Reject"}
                                                    >
                                                        <X size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            )}
                                            <Link
                                                href={`pending-request/${req.patientCasePublicId}`}
                                                className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all active:scale-95"
                                            >
                                                {isRtl ? "عرض التفاصيل الكاملة" : "View Full Details"}
                                                {isRtl ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <motion.div variants={itemVariants} className="flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/60 shadow-sm">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            {isRtl ? `صفحة ${pagination.currentPage} من ${pagination.totalPages}` : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
                        </span>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPreviousPage}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                            >
                                {isRtl ? "السابق" : "Previous"}
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-amber-500/20"
                            >
                                {isRtl ? "التالي" : "Next"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

function InfoRow({ icon, label, value, truncate = true }: { icon: React.ReactNode; label: string; value: string; truncate?: boolean }) {
    return (
        <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-amber-500 dark:text-amber-400 shrink-0 bg-amber-50 dark:bg-amber-900/30 p-1.5 rounded-lg">{icon}</span>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">{label}:</span>
                <span className={`text-slate-700 dark:text-slate-200 font-black ${truncate ? "truncate" : ""}`}>{value}</span>
            </div>
        </div>
    );
}
