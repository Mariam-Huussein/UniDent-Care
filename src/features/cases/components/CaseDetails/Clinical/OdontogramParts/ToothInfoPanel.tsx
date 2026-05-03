"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X, Stethoscope, GraduationCap, FileText,
    Tag, AlertCircle, MousePointerClick, Activity,
} from "lucide-react";
import PersonRow from "./PersonRow";
import InfoRow from "./InfoRow";
import { DiagnosisStage } from "@/features/cases/types/CaseDetails.types";

export interface ToothPanelData {
    toothNumber: number;
    caseType: string;
    diagnosisStage: DiagnosisStage;
    notes: string;
    assignedStudentName?: string | null;
    assignedDoctorName?: string | null;
}

interface ToothInfoPanelProps {
    data: ToothPanelData | null;
    onClose: () => void;
}

const getStageLabel = (data : ToothPanelData | null) => {
    const stage = data?.diagnosisStage;
    
    if (stage === 0 || stage === "AI") return "AI";
    
    if (stage === 1 || stage === "BasicClinic") return "Basic Clinic";
    
    return "Unknown";
};

export default function ToothInfoPanel({ data, onClose }: ToothInfoPanelProps) {
    return (
        <AnimatePresence mode="wait">
            {data ? (
                <motion.div
                    key="panel"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.25)] flex flex-col overflow-hidden"
                >
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-indigo-50/80 to-violet-50/60 dark:from-indigo-900/20 dark:to-violet-900/10 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
                                <span className="text-sm font-extrabold text-white">
                                    #{data.toothNumber}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                                    Tooth {data.toothNumber}
                                </p>
                                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 uppercase tracking-wider font-bold mt-0.5">
                                    Diagnosis Info
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-lg hover:bg-slate-200/80 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
                            value={data.caseType || "Unkown"}
                        />

                        {/* Diagnosis Stage */}
                        <InfoRow
                            icon={<AlertCircle size={13} className="text-amber-500" />}
                            label="Stage"
                            value={getStageLabel(data)}
                        />

                        {/* Divider */}
                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* Notes */}
                        {data.notes ? (
                            <div className="rounded-xl bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/40 p-3.5">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <FileText size={12} className="text-indigo-400 dark:text-indigo-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
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
                            <div className="flex items-center gap-2 bg-linear-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/10 dark:to-violet-900/10 border border-indigo-100 dark:border-indigo-800/40 rounded-xl px-3.5 py-2.5">
                                <Activity size={14} className="text-indigo-500 shrink-0" />
                                <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                                    Case is under active treatment
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-linear-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/20 dark:to-indigo-900/10 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-2xl flex flex-col items-center justify-center text-center p-8 gap-4"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-sm">
                        <MousePointerClick size={20} className="text-indigo-400 dark:text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            No tooth selected
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed max-w-[160px] mx-auto">
                            Click any tooth on the chart to view its diagnosis details
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}