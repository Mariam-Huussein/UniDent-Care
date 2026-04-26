"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock, Square, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SessionTopBarProps {
    patientName: string;
    sessionId: string;
    caseId: string;
    onEndSession?: () => void;
    endSessionLoading?: boolean;
    sessionStatus?: string;
}

function formatElapsed(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts: string[] = [];
    if (h > 0) parts.push(`${h}h`);
    parts.push(`${String(m).padStart(2, "0")}m`);
    parts.push(`${String(s).padStart(2, "0")}s`);
    return parts.join(" ");
}

export default function SessionTopBar({
    patientName,
    sessionId,
    caseId,
    onEndSession,
    endSessionLoading = false,
    sessionStatus,
}: SessionTopBarProps) {
    const router = useRouter();
    const [elapsed, setElapsed] = useState(0);

    const isDone = sessionStatus?.toLowerCase() === "done";

    useEffect(() => {
        if (isDone) return;
        const interval = setInterval(() => setElapsed((p) => p + 1), 1000);
        return () => clearInterval(interval);
    }, [isDone]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/my-cases/${caseId}`)}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft size={17} />
                </motion.button>
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                        Session — {patientName}
                    </h1>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        {isDone ? "Session completed" : "Active clinical session"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Live Timer */}
                {!isDone && (
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 shadow-sm">
                        <Clock size={14} className="text-indigo-500" />
                        <span className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums tracking-wide">
                            {formatElapsed(elapsed)}
                        </span>
                    </div>
                )}

                {/* Status Badge */}
                {isDone ? (
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 tracking-wide uppercase shadow-sm border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Completed
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl bg-amber-50 text-amber-600 tracking-wide uppercase shadow-sm border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                        </span>
                        In Progress
                    </span>
                )}

                {/* End Session Button */}
                {!isDone && onEndSession && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onEndSession}
                        disabled={endSessionLoading}
                        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        {endSessionLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Square size={14} fill="currentColor" />
                        )}
                        {endSessionLoading ? "Ending..." : "End Session"}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}
