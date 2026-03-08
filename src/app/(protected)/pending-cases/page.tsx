"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    User,
    Search,
    MapPin,
    GraduationCap,
    Calendar,
    ChevronRight,
    ChevronLeft,
    Loader2,
    FileText,
    Filter,
    ArrowUpDown
} from "lucide-react";
import { doctorService } from "@/features/settings/services/doctorService";
import toast from "react-hot-toast";

interface PendingCase {
    id: string;
    patientCasePublicId: string;
    patientName: string;
    caseName: string;
    studentName: string;
    university: string;
    level: number;
    description: string;
    status: string;
    createAt: string;
}

export default function PendingCasesPage() {
    const [cases, setCases] = useState<PendingCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchCases = async (currentPage: number) => {
        setLoading(true);
        try {
            const res = await doctorService.getPendingRequests(currentPage, 10);
            if (res.success) {
                setCases(res.data.items);
                setTotalPages(res.data.totalPages);
                setTotalCount(res.data.totalCount);
            }
        } catch (err) {
            console.error("Failed to fetch pending cases:", err);
            toast.error("Failed to load pending cases");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases(page);
    }, [page]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Clock className="text-amber-500" size={32} />
                        Pending Case Approvals
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        You have <span className="text-blue-600 font-bold">{totalCount}</span> cases awaiting your review.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student or patient..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {loading && page === 1 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                    <p className="text-slate-500 font-bold animate-pulse">Syncing with hospital records...</p>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-4"
                >
                    {cases.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">All caught up!</h3>
                            <p className="text-slate-500 font-medium">No pending cases require your attention at the moment.</p>
                        </div>
                    ) : (
                        cases.map((c) => (
                            <motion.div
                                key={c.id}
                                variants={itemVariants}
                                className="group bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    {/* Case & Patient Info */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{c.caseName}</h3>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mt-0.5">
                                                <User size={14} className="text-blue-500" />
                                                Patient: {c.patientName}
                                            </div>
                                            <p className="text-slate-400 text-sm mt-2 line-clamp-1 italic">"{c.description || 'No description provided.'}"</p>
                                        </div>
                                    </div>

                                    {/* Student Info */}
                                    <div className="flex flex-wrap items-center gap-6 lg:border-l lg:border-slate-100 lg:pl-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Student</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">
                                                    {c.studentName.charAt(0)}
                                                </div>
                                                <span className="text-slate-900 font-bold">{c.studentName}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Level</p>
                                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                <GraduationCap size={16} className="text-indigo-500" />
                                                Level {c.level}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submission Date</p>
                                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                <Calendar size={16} className="text-slate-400" />
                                                {new Date(c.createAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 lg:border-l lg:border-slate-100 lg:pl-8">
                                        <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-950/5 active:scale-95">
                                            Review Case
                                        </button>
                                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12 bg-white rounded-3xl p-3 border border-slate-100 shadow-sm w-fit mx-auto">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${page === i + 1
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-xl hover:bg-slate-50 disabled:opacity-30 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}