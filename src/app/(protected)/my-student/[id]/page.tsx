"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    FileText,
    User,
    GraduationCap,
    Hospital,
    BookOpen,
    Stethoscope,
    Calendar,
    Info,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { doctorDashboardService, CaseRequest } from "@/features/dashboard/services/doctorDashboardService";

const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return {
                bg: "bg-emerald-100 dark:bg-emerald-900/30",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200/50 dark:border-emerald-800/50",
                bar: "from-emerald-400 to-emerald-600",
                icon: <CheckCircle2 size={16} />,
            };
        case "rejected":
            return {
                bg: "bg-red-100 dark:bg-red-900/30",
                text: "text-red-700 dark:text-red-400",
                border: "border-red-200/50 dark:border-red-800/50",
                bar: "from-red-400 to-red-600",
                icon: <XCircle size={16} />,
            };
        default:
            return {
                bg: "bg-amber-100 dark:bg-amber-900/30",
                text: "text-amber-700 dark:text-amber-400",
                border: "border-amber-200/50 dark:border-amber-800/50",
                bar: "from-amber-400 to-amber-600",
                icon: <Clock size={16} />,
            };
    }
};

interface DetailField { icon: React.ReactNode; label: string; value: string | number }

export default function MyStudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const requestId = params?.id as string;

    const [request, setRequest] = useState<CaseRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequest = async () => {
        if (!requestId) return;
        try {
            setLoading(true);
            setError(null);
            const data = await doctorDashboardService.getCaseRequestById(requestId);
            setRequest(data);
        } catch (err: any) {
            console.error("Failed to fetch request:", err);
            setError("Could not load request details. It may not exist.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequest();
    }, [requestId]);

    const getInitials = (name: string) =>
        name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

    const fields: DetailField[] = request
        ? [
            { icon: <FileText size={15} />, label: "Case Name", value: request.caseName },
            { icon: <User size={15} />, label: "Patient Name", value: request.patientName || "N/A" },
            { icon: <GraduationCap size={15} />, label: "Student Name", value: request.studentName },
            { icon: <BookOpen size={15} />, label: "Student ID", value: request.studentPublicId },
            { icon: <Hospital size={15} />, label: "University", value: request.university },
            { icon: <Info size={15} />, label: "Level", value: request.level },
            { icon: <Stethoscope size={15} />, label: "Doctor Name", value: request.doctorName },
            {
                icon: <Calendar size={15} />,
                label: "Submitted On",
                value: new Date(request.createAt).toLocaleDateString(
                    isRtl ? "ar-EG" : "en-GB",
                    { day: "numeric", month: "long", year: "numeric" }
                ),
            },
        ]
        : [];

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6" dir={isRtl ? "rtl" : "ltr"}>
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
            >
                <ArrowLeft size={16} className={`transition-transform group-hover:-translate-x-1 ${isRtl ? "rotate-180" : ""}`} />
                Back to Student List
            </button>

            {loading ? (
                <div className="space-y-4">
                    <div className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse" />
                    <div className="h-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse" />
                </div>
            ) : error ? (
                <div className="py-24 text-center">
                    <p className="text-lg font-bold text-slate-500 dark:text-slate-400">{error}</p>
                    <button
                        onClick={fetchRequest}
                        className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:bg-indigo-100 transition-colors"
                    >
                        <RefreshCw size={14} className="inline mr-1.5" />
                        Retry
                    </button>
                </div>
            ) : request ? (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5"
                >
                    {/* Student banner */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        {/* Gradient bar */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${getStatusStyles(request.status).bar}`} />
                        <div className="p-6 flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 shrink-0">
                                {getInitials(request.studentName)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-black text-slate-800 dark:text-white truncate">
                                    {request.studentName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                    <span className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                        <Hospital size={13} /> {request.university}
                                    </span>
                                    <span className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                        <BookOpen size={13} /> Level {request.level}
                                    </span>
                                </div>
                            </div>
                            {/* Status badge */}
                            {(() => {
                                const s = getStatusStyles(request.status);
                                return (
                                    <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${s.bg} ${s.text} ${s.border} shrink-0`}>
                                        {s.icon}
                                        {request.status}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">Description</p>
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                {request.description}
                            </p>
                        </div>
                    )}

                    {/* All info fields */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">Request Information</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {fields.map((field, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <span className="text-indigo-500 dark:text-indigo-400 mt-0.5 shrink-0">{field.icon}</span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{field.label}</p>
                                        <p className="text-slate-800 dark:text-white font-semibold text-sm mt-0.5 break-all">{field.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ) : null}
        </div>
    );
}
