"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, Clock, CheckCircle2, AlertCircle, CalendarDays, FileText, Star } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { SessionDto, CaseRequest } from "../../services/doctorDashboardService";
import { format, parseISO } from "date-fns";
import Link from "next/link";

interface DayDetailDrawerProps {
    open: boolean;
    date: string | null;
    sessions: SessionDto[];
    pendingRequests: CaseRequest[];
    onClose: () => void;
}

function StatusBadge({ status, evaluteDoctorId }: { status: string | null; evaluteDoctorId: string | null }) {
    const { language } = useLanguage();
    const isRtl = language === "ar";

    if (status === "Done" && !evaluteDoctorId) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                <AlertCircle size={10} />
                {isRtl ? "يحتاج تقييم" : "Needs Evaluation"}
            </span>
        );
    }
    if (status === "Done") {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={10} />
                {isRtl ? "منتهية" : "Completed"}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Clock size={10} />
            {isRtl ? "مجدولة" : "Scheduled"}
        </span>
    );
}

export function DayDetailDrawer({
    open,
    date,
    sessions,
    pendingRequests,
    onClose,
}: DayDetailDrawerProps) {
    const { language } = useLanguage();
    const isRtl = language === "ar";

    const formattedDate = date
        ? (() => {
              try {
                  return format(parseISO(date), "EEEE, MMMM d, yyyy");
              } catch {
                  return date;
              }
          })()
        : "";

    const hasContent = sessions.length > 0 || pendingRequests.length > 0;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="drawer"
                        initial={{ x: isRtl ? "-100%" : "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isRtl ? "-100%" : "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed top-0 ${isRtl ? "left-0" : "right-0"} z-50 h-full w-full max-w-[440px] bg-white dark:bg-slate-950 shadow-2xl flex flex-col`}
                        dir={isRtl ? "rtl" : "ltr"}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-600 to-violet-600">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-white/70 text-xs font-bold mb-1">
                                        <CalendarDays size={12} />
                                        {isRtl ? "تفاصيل اليوم" : "Day Details"}
                                    </div>
                                    <h2 className="text-white font-black text-lg leading-tight">
                                        {formattedDate}
                                    </h2>
                                    <p className="text-white/70 text-xs mt-1">
                                        {sessions.length}{" "}
                                        {isRtl ? "جلسة" : sessions.length === 1 ? "session" : "sessions"}
                                        {pendingRequests.length > 0 &&
                                            ` · ${pendingRequests.length} ${isRtl ? "طلب معلق" : "pending"}`}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                            {!hasContent ? (
                                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                                    <CalendarDays size={40} strokeWidth={1.5} className="text-slate-300 dark:text-slate-700" />
                                    <p className="text-sm font-semibold">
                                        {isRtl ? "لا توجد جلسات في هذا اليوم" : "No sessions for this day"}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Pending Requests section */}
                                    {pendingRequests.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                {isRtl ? "طلبات معلقة" : "Pending Requests"}
                                            </h3>
                                            <div className="space-y-3">
                                                {pendingRequests.map((req) => (
                                                    <motion.div
                                                        key={req.id}
                                                        initial={{ opacity: 0, x: 16 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="p-4 rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-900/10"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">
                                                                    {req.caseName || (isRtl ? "حالة" : "Case")}
                                                                </p>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                                    {req.studentName} · {req.patientName}
                                                                </p>
                                                            </div>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
                                                                {isRtl ? "معلق" : "Pending"}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 mt-3">
                                                            <Link
                                                                href={`/cases/${req.patientCasePublicId}`}
                                                                className="flex-1 text-center text-xs font-bold py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                                                            >
                                                                {isRtl ? "عرض الحالة" : "View Case"}
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sessions section */}
                                    {sessions.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                {isRtl ? "الجلسات" : "Sessions"}
                                            </h3>
                                            <div className="space-y-3">
                                                {sessions.map((session) => {
                                                    const isUrgent = session.status === "Done" && !session.evaluteDoctorId;
                                                    const isDone = session.status === "Done";
                                                    return (
                                                        <motion.div
                                                            key={session.id}
                                                            initial={{ opacity: 0, x: 16 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className={`p-4 rounded-2xl border ${
                                                                isUrgent
                                                                    ? "border-red-100 dark:border-red-900/40 bg-red-50/40 dark:bg-red-900/10"
                                                                    : isDone
                                                                    ? "border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-900/10"
                                                                    : "border-blue-100 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-900/10"
                                                            }`}
                                                        >
                                                            {/* Session header */}
                                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-bold text-slate-800 dark:text-white text-sm">
                                                                        {session.treatmentType || (isRtl ? "جلسة" : "Session")}
                                                                    </p>
                                                                    <StatusBadge
                                                                        status={session.status}
                                                                        evaluteDoctorId={session.evaluteDoctorId}
                                                                    />
                                                                </div>
                                                                {session.grade > 0 && (
                                                                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                                        <Star size={13} />
                                                                        <span className="text-xs font-black">{session.grade}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Student & Patient */}
                                                            <div className="space-y-1.5">
                                                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                                    <User size={12} className="text-slate-400 shrink-0" />
                                                                    <span>
                                                                        <span className="font-bold">{isRtl ? "الطالب:" : "Student:"}</span>{" "}
                                                                        {session.studentName || "—"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                                                    <User size={12} className="text-slate-400 shrink-0" />
                                                                    <span>
                                                                        <span className="font-bold">{isRtl ? "المريض:" : "Patient:"}</span>{" "}
                                                                        {session.patientName || "—"}
                                                                    </span>
                                                                </div>
                                                                {session.totalNotes > 0 && (
                                                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                                        <FileText size={12} className="shrink-0" />
                                                                        <span>
                                                                            {session.totalNotes}{" "}
                                                                            {isRtl ? "ملاحظة" : session.totalNotes === 1 ? "note" : "notes"}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {session.scheduledAt && (
                                                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                                        <Clock size={12} className="shrink-0" />
                                                                        <span>
                                                                            {(() => {
                                                                                try {
                                                                                    return format(parseISO(session.scheduledAt), "h:mm a");
                                                                                } catch {
                                                                                    return session.scheduledAt;
                                                                                }
                                                                            })()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="mt-3 flex gap-2">
                                                                <Link
                                                                    href={`/cases/${session.caseId}`}
                                                                    className="flex-1 text-center text-xs font-bold py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                                                                >
                                                                    {isRtl ? "عرض الحالة" : "View Case"}
                                                                </Link>
                                                                {isUrgent && (
                                                                    <Link
                                                                        href={`/cases/${session.caseId}`}
                                                                        className="flex-1 text-center text-xs font-bold py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
                                                                    >
                                                                        {isRtl ? "تقييم" : "Evaluate"}
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
