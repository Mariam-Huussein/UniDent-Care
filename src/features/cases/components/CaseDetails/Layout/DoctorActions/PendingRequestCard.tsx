"use client";

import { motion } from "framer-motion";
import {
    Send, GraduationCap, Loader2, CheckCheck, X,
} from "lucide-react";
import { CaseRequestData } from "../../../../types/caseCardProps.types";

interface PendingRequestCardProps {
    requestData: CaseRequestData;
    approveLoading: boolean;
    rejectLoading: boolean;
    onApprove: () => void;
    onReject: () => void;
}

export default function PendingRequestCard({
    requestData,
    approveLoading,
    rejectLoading,
    onApprove,
    onReject,
}: PendingRequestCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/50 p-4 space-y-3"
        >
            {/* Header */}
            <div className="flex items-center gap-2">
                <Send size={14} className="text-amber-600 dark:text-amber-400" />
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Incoming Request
                </p>
            </div>

            {/* Student Info Card */}
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                            {requestData.studentName}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {requestData.university} · Level {requestData.level}
                        </p>
                    </div>
                </div>
                {requestData.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-2">
                        &ldquo;{requestData.description}&rdquo;
                    </p>
                )}
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Requested {new Date(requestData.createAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
            </div>

            {/* Approve / Reject Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={onReject}
                    disabled={rejectLoading || approveLoading}
                    className="my-btn-outline flex-1 py-2.5 text-sm group text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                    {rejectLoading ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Rejecting...
                        </>
                    ) : (
                        <>
                            <X size={14} className="group-hover:scale-110 transition-transform" />
                            Reject
                        </>
                    )}
                </button>
                <button
                    onClick={onApprove}
                    disabled={approveLoading || rejectLoading}
                    className={`my-btn flex-1 py-2.5 text-sm group ${(approveLoading || rejectLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {approveLoading ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Approving...
                        </>
                    ) : (
                        <>
                            <CheckCheck size={14} className="group-hover:scale-110 transition-transform" />
                            Approve
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
