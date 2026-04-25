"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X, Stethoscope, GraduationCap, FileText,
    Tag, AlertCircle, CheckCircle2, MousePointerClick,
} from "lucide-react";
import PersonRow from "./PersonRow";
import InfoRow from "./InfoRow";

export interface ToothPanelData {
    toothNumber: number;
    caseType: string;
    diagnosisStage: string;
    notes: string;
    assignedStudentName?: string | null;
    assignedDoctorName?: string | null;
}

interface ToothInfoPanelProps {
    data: ToothPanelData | null;
    onClose: () => void;
}

export default function ToothInfoPanel({ data, onClose }: ToothInfoPanelProps) {
    return (
        <AnimatePresence mode="wait">
            {data ? (
                <motion.div
                    key="panel"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 18 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex flex-col overflow-hidden"
                >
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                                <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                                    #{data.toothNumber}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                                    Tooth {data.toothNumber}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                                    Diagnosis Info
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            title="Close"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* ── Body ── */}
                    <div className="flex-1 overflow-y-auto patient-details-scrollbar p-5 space-y-4">

                        {/* Case Type */}
                        <InfoRow
                            icon={<Tag size={13} className="text-indigo-500 dark:text-indigo-400" />}
                            label="Case Type"
                            value={data.caseType || "—"}
                        />

                        {/* Diagnosis Stage */}
                        <InfoRow
                            icon={<AlertCircle size={13} className="text-amber-500" />}
                            label="Stage"
                            value={data.diagnosisStage || "—"}
                        />

                        {/* Divider */}
                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Notes */}
                        {data.notes ? (
                            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 p-3.5">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <FileText size={12} className="text-slate-400 dark:text-slate-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                        Clinical Notes
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {data.notes}
                                </p>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 dark:text-slate-500 italic px-1">
                                No clinical notes recorded.
                            </p>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Assigned Student */}
                        <PersonRow
                            icon={<GraduationCap size={14} className="text-emerald-500" />}
                            role="Assigned Student"
                            name={data.assignedStudentName}
                            emptyLabel="Not yet assigned"
                        />

                        {/* Supervising Doctor */}
                        <PersonRow
                            icon={<Stethoscope size={14} className="text-blue-500" />}
                            role="Supervising Doctor"
                            name={data.assignedDoctorName}
                            prefix="Dr."
                            emptyLabel="Not yet assigned"
                        />

                        {/* Status pill */}
                        <div className="pt-1">
                            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/40 rounded-xl px-3.5 py-2.5">
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                    Case is under active treatment
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                /* Empty / idle state — shows when no tooth is selected */
                <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-slate-50/60 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-2xl flex flex-col items-center justify-center text-center p-8 gap-3"
                >
                    <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <MousePointerClick size={18} className="text-slate-400 dark:text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            No tooth selected
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                            Click any tooth on the chart to view its diagnosis details
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}