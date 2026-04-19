"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion, Variants } from "framer-motion";
import {
    GraduationCap,
    Hospital,
    BookOpen,
    ChevronRight,
    RefreshCw,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    ClipboardList,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Cookies from "js-cookie";
import Link from "next/link";
import { doctorDashboardService, CaseRequest } from "@/features/dashboard/services/doctorDashboardService";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

interface StudentGroup {
    studentPublicId: string;
    studentName: string;
    university: string;
    level: number;
    requests: CaseRequest[];
}

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return {
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                text: "text-emerald-700 dark:text-emerald-400",
                icon: <CheckCircle2 size={12} />,
            };
        case "rejected":
            return {
                bg: "bg-red-100 dark:bg-red-900/30",
                text: "text-red-700 dark:text-red-400",
                icon: <XCircle size={12} />,
            };
        default:
            return {
                bg: "bg-amber-100 dark:bg-amber-900/30",
                text: "text-amber-700 dark:text-amber-400",
                icon: <Clock size={12} />,
            };
    }
};

export default function MyStudentPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const doctorId =
        (user as any)?.publicId ??
        (user as any)?.id ??
        Cookies.get("user_id");

    const [students, setStudents] = useState<StudentGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalRequests, setTotalRequests] = useState(0);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            // Fetch up to 100 requests to cover most cases in one shot
            const res = await doctorDashboardService.getDoctorRequests(1, 100);
            setTotalRequests(res.totalCount);

            // Group by studentPublicId
            const map = new Map<string, StudentGroup>();
            for (const req of res.items) {
                if (!map.has(req.studentPublicId)) {
                    map.set(req.studentPublicId, {
                        studentPublicId: req.studentPublicId,
                        studentName: req.studentName,
                        university: req.university,
                        level: req.level,
                        requests: [],
                    });
                }
                map.get(req.studentPublicId)!.requests.push(req);
            }

            // Sort students: those with Pending first
            const sorted = Array.from(map.values()).sort((a, b) => {
                const aPending = a.requests.some((r) => r.status === "Pending") ? 0 : 1;
                const bPending = b.requests.some((r) => r.status === "Pending") ? 0 : 1;
                return aPending - bPending;
            });

            setStudents(sorted);
        } catch (err) {
            console.error("Failed to fetch students:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const getInitials = (name: string) =>
        name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6" dir={isRtl ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
                        <Users size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Student List</h1>
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                            {loading ? "Loading…" : `${students.length} students · ${totalRequests} total requests`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchStudents}
                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                        <ClipboardList size={40} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-lg font-bold text-slate-500 dark:text-slate-400">No students yet</p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Students who send you case requests will appear here.
                    </p>
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {students.map((student) => {
                        const hasPending = student.requests.some((r) => r.status === "Pending");
                        return (
                            <motion.div
                                key={student.studentPublicId}
                                variants={cardVariants}
                                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                {/* Student Info Header */}
                                <div className="p-5 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
                                        {getInitials(student.studentName)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-slate-800 dark:text-white text-base truncate">
                                                {student.studentName}
                                            </h3>
                                            {hasPending && (
                                                <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                                <Hospital size={11} />
                                                {student.university}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                                <BookOpen size={11} />
                                                Level {student.level}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                                <GraduationCap size={11} />
                                                {student.requests.length} request{student.requests.length !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Requests list */}
                                <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                    {student.requests.map((req) => {
                                        const s = getStatusStyles(req.status);
                                        return (
                                            <div key={req.id} className="flex items-center justify-between px-5 py-3 gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{req.caseName}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                        {new Date(req.createAt).toLocaleDateString(isRtl ? "ar-EG" : "en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                                                        {s.icon}
                                                        {req.status}
                                                    </span>
                                                    <Link
                                                        href={`/my-student/${req.id}`}
                                                        className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-300 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}
