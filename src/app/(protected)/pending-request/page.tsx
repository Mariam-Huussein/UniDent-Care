"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import {
    ClipboardClock,
    Clock,
    CheckCircle2,
    XCircle,
    LayoutGrid,
    List,
    RefreshCw,
    Search,
    Calendar,
    User,
    GraduationCap,
    Eye,
    Check,
    X,
    Activity,
    Briefcase,
    Loader2
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import { doctorDashboardService, CaseRequest, PaginatedRequests } from "@/features/dashboard/services/doctorDashboardService";
import Link from "next/link";
import CaseCard from "@/features/cases/components/CaseCard";
import Pagination from "@/components/common/pagination";
import DataTable, { Column } from "@/components/common/DataTable";
import GridControlsToolbar from "@/features/cases/components/AvailableCases/GridControlsToolbar";
import { CaseItem } from "@/features/cases/types/caseCardProps.types";
import { getCaseStatusConfig } from "@/features/cases/components/MyCasesStudent/getCaseStatusConfig";
import { MyCasesSkeleton } from "@/features/cases/components/MyCasesStudent/MyCasesSkeleton";
import { MyCasesEmptyState } from "@/features/cases/components/MyCasesStudent/MyCasesEmptyState";
import { useFilterCases } from "@/features/cases/hooks/useFilterCases";

const TABS = [
    { id: "all", label: "All", labelAr: "الكل", icon: Activity, value: undefined },
    { id: "pending", label: "Pending", labelAr: "معلق", icon: Clock, value: 0 },
    { id: "approved", label: "Approved", labelAr: "مقبول", icon: CheckCircle2, value: 2 },
    { id: "rejected", label: "Rejected", labelAr: "مرفوض", icon: XCircle, value: 3 },
];

const mapCaseRequestToCaseItem = (item: CaseRequest): CaseItem => {
    const caseDisplayName = item.diagnosisdto?.[0]?.caseTypeName;

    return {
        id: item.patientCasePublicId || item.id,
        patientId: "",
        patientName: item.patientName || "Unknown",
        patientAge: 0,
        caseType: caseDisplayName ? { publicId: "", name: caseDisplayName, description: item.description || "" } : null,
        status: item.status || "Pending",
        createAt: item.createAt,
        imageUrls: item.imageUrls || [],
        gender: undefined,
        diagnosisdto: item.diagnosisdto || null,
        description: item.description
    };
};

export default function PendingRequestsPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const doctorId = (user as any)?.publicId ?? (user as any)?.id ?? Cookies.get("user_id");

    const [requests, setRequests] = useState<CaseRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(TABS[1].id); // Default to Pending
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const activeStatus = useMemo(() => TABS.find(t => t.id === activeTab)?.value, [activeTab]);

    const mappedCases = useMemo(() => requests.map(mapCaseRequestToCaseItem), [requests]);
    const { 
        filters, handleFilterChange, clearFilters, sortConfig, handleSort, hasActiveFilters, filteredAndSortedCases 
    } = useFilterCases(mappedCases);

    const filteredRequests = useMemo(() => {
        return filteredAndSortedCases.map(caseItem => requests.find(r => (r.patientCasePublicId || r.id) === caseItem.id)).filter(Boolean) as CaseRequest[];
    }, [filteredAndSortedCases, requests]);

    const fetchRequests = useCallback(async () => {
        if (!doctorId) return;
        try {
            setLoading(true);
            const res = await doctorDashboardService.getDoctorRequests({
                page,
                pageSize: 50, // Increased page size for better front-end filtering experience
                status: activeStatus,
                sortDirection: "desc"
            });
            setRequests(res.items || []);
            setTotalCount(res.totalCount || 0);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error("Failed to fetch requests:", err);
            setRequests([]);
            setTotalCount(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [doctorId, page, activeStatus]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleTabChange = (id: string) => {
        setActiveTab(id);
        setPage(1);
    };

    const handleApprove = async (requestId: string) => {
        if (actionLoading) return;
        try {
            setActionLoading(requestId);
            await doctorDashboardService.approveRequest(requestId);
            fetchRequests();
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
            fetchRequests();
        } catch (err) {
            console.error("Failed to reject:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const columns: Column<CaseRequest>[] = [
        {
            header: isRtl ? "الحالة" : "Case",
            accessor: "caseTypeName",
            render: (val, row) => (
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{val || row.caseName || 'Uncategorized'}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(row.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-US")}
                    </span>
                </div>
            )
        },
        {
            header: isRtl ? "المريض" : "Patient",
            accessor: "patientName",
            render: (val) => (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <User size={14} className="text-indigo-500" />
                    {val || "—"}
                </div>
            )
        },
        {
            header: isRtl ? "الطالب" : "Student",
            accessor: "studentName",
            render: (val, row) => (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <GraduationCap size={14} className="text-amber-500" />
                        {val}
                    </div>
                    <span className="text-[10px] text-slate-400">{row.university}</span>
                </div>
            )
        },
        {
            header: isRtl ? "الحالة" : "Status",
            accessor: "status",
            render: (val) => {
                const isPending = val === "Pending";
                const isApproved = val === "Approved";
                return (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isApproved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        val === "Rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                        {isApproved ? <Check size={10} /> : val === "Rejected" ? <X size={10} /> : <Clock size={10} />}
                        {val}
                    </span>
                );
            }
        },
        {
            header: "",
            accessor: "id",
            render: (val, row) => (
                <div className="flex items-center justify-end gap-2">
                    {row.status === "Pending" && (
                        <>
                            <button
                                onClick={() => handleApprove(row.id)}
                                disabled={!!actionLoading}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                title="Approve"
                            >
                                {actionLoading === row.id ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                            </button>
                            <button
                                onClick={() => handleReject(row.id)}
                                disabled={!!actionLoading}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                title="Reject"
                            >
                                {actionLoading === row.id ? <RefreshCw size={14} className="animate-spin" /> : <X size={14} />}
                            </button>
                        </>
                    )}
                    <Link href={`/pending-request/${row.patientCasePublicId}`} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        <Eye size={14} />
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300" dir={isRtl ? "rtl" : "ltr"}>
            
            {/* Premium Header */}
            <div className="relative z-50 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 mb-8 overflow-hidden backdrop-blur-xl transition-all duration-300">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 rounded-full bg-amber-50 dark:bg-amber-500/5 blur-3xl opacity-60 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 rounded-full bg-indigo-50 dark:bg-indigo-500/5 blur-3xl opacity-60 pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left Side */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-600/20 text-white">
                                <ClipboardClock size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                                    {isRtl ? "طلبات الحالات" : "Case Requests"}
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
                                    {isRtl ? "مراجعة وإدارة طلبات الحالات الواردة من الطلاب." : "Review and manage incoming case requests from students."}
                                </p>
                            </div>
                        </div>

                        <AnimatePresence>
                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full w-fit">
                                    <Loader2 size={14} className="animate-spin text-amber-500" />
                                    <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">Syncing...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Tabs & View Mode */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Tabs */}
                        <div className="flex bg-slate-100/80 dark:bg-slate-950/50 p-1 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 w-fit">
                            {TABS.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${isActive ? "text-amber-600 dark:text-amber-300" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                                    >
                                        {isActive && (
                                            <motion.div layoutId="header-active-pill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Icon size={14} className={isActive ? "text-amber-600 dark:text-amber-400" : "opacity-60"} />
                                            {isRtl ? tab.labelAr : tab.label}
                                            {isActive && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                                                    {totalCount}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

                        {/* View Mode Toggle */}
                        <div className="flex bg-slate-100 dark:bg-slate-950/50 p-1 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Toolbar */}
            <GridControlsToolbar 
                filters={filters}
                onFilterChange={handleFilterChange}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                sortConfig={sortConfig}
                onSort={handleSort}
                hideGender={true}
            />

            {/* Content Area */}
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
                ) : requests.length === 0 ? (
                    <MyCasesEmptyState message={isRtl ? "لا توجد طلبات تطابق معايير البحث." : "No requests found matching your criteria."} />
                ) : (
                    viewMode === 'grid' ? (
                        <motion.div layout className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 place-items-center">
                            <AnimatePresence>
                                {filteredAndSortedCases.map((caseItem, i) => {
                                    // Find back the original request to get status/student info
                                    const item = requests.find(r => (r.patientCasePublicId || r.id) === caseItem.id)!;
                                    const status = item.status;
                                    const isApproved = status === "Approved";
                                    const isRejected = status === "Rejected";
                                    const isPending = status === "Pending";
                                    
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
                                                caseItem={caseItem}
                                                hideRequestButton={true}
                                                navigationPath={`/pending-request`}
                                                customBadge={
                                                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full p-0.5 shadow-sm ring-1 ring-white/50 dark:ring-slate-700">
                                                        <span className={`shrink-0 flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                                                            isApproved ? "bg-emerald-100 text-emerald-700" :
                                                            isRejected ? "bg-red-100 text-red-700" :
                                                            "bg-amber-100 text-amber-700"
                                                        }`}>
                                                            {isPending && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                            {status}
                                                        </span>
                                                    </div>
                                                }
                                                additionalInfo={
                                                    <div className="flex flex-col gap-1 mb-2">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                                                            <GraduationCap size={14} className="text-amber-500" />
                                                            <span>{item.studentName}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 ml-5">
                                                            <Briefcase size={12} />
                                                            <span>{item.university}</span>
                                                        </div>
                                                    </div>
                                                }
                                                footer={
                                                    <div className="flex flex-col gap-2 mt-3">
                                                        {isPending && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); handleApprove(item.id); }}
                                                                    disabled={!!actionLoading}
                                                                    className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl text-[11px] font-black bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                                                                >
                                                                    {actionLoading === item.id ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                                    {isRtl ? "موافقة" : "Approve"}
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.preventDefault(); handleReject(item.id); }}
                                                                    disabled={!!actionLoading}
                                                                    className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-100 dark:border-red-900/30 transition-all active:scale-95"
                                                                    title={isRtl ? "رفض" : "Reject"}
                                                                >
                                                                    <X size={14} strokeWidth={3} />
                                                                </button>
                                                            </div>
                                                        )}
                                                        <Link
                                                            href={`/pending-request/${item.patientCasePublicId}`}
                                                            className="w-full h-9 inline-flex items-center justify-center gap-2 rounded-xl text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all active:scale-95"
                                                        >
                                                            <Eye size={14} />
                                                            {isRtl ? "عرض التفاصيل" : "View Details"}
                                                        </Link>
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
                            <DataTable columns={columns} data={filteredRequests} />
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
