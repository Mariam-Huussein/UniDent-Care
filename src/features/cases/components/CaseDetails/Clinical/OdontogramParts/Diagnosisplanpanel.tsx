"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToothData } from "@/features/cases/types/CaseDetails.types";
import { ClipboardList, Trash2, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import type { ToothDetail } from "react-odontogram";
import ToothDiagnosisCard from "./Toothdiagnosiscard";
import { useCase } from "@/features/cases/context/CaseContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { submitDiagnoses } from "@/features/cases/server/diagnoses.action";
import toast from "react-hot-toast";

interface DiagnosisPlanPanelProps {
    selected: ToothDetail[];
    teethMap: Map<number, ToothData>;
    onClearAll: () => void;
    onRemoveTooth: (fdiNum: number) => void;
    onUpdateTooth: (num: number, updates: Partial<ToothData>) => void;
}

export default function DiagnosisPlanPanel({
    selected,
    teethMap,
    onClearAll,
    onRemoveTooth,
    onUpdateTooth,
}: DiagnosisPlanPanelProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { caseData } = useCase();
    const auth = useSelector((state: RootState) => state.auth);

    const handleSubmit = async () => {
        if (selected.length === 0) return;
        setIsSubmitting(true);

        try {
            const groups: Record<string, { caseTypeId: string; notes: string; teethNumbers: number[] }> = {};

            for (const selTooth of selected) {
                const fdiNum = Number(selTooth.notations.fdi);
                const toothData = teethMap.get(fdiNum);

                if (toothData && toothData.status !== "healthy" && toothData.caseTypeId) {
                    const key = `${toothData.caseTypeId}_${toothData.notes || ""}`;
                    if (!groups[key]) {
                        groups[key] = { caseTypeId: toothData.caseTypeId, notes: toothData.notes || "", teethNumbers: [] };
                    }
                    groups[key].teethNumbers.push(fdiNum);
                }
            }

            const groupValues = Object.values(groups);

            if (groupValues.length === 0) {
                toast.error("Please select a treatment type for the unhealthy teeth before submitting.");
                return;
            }

            for (const group of groupValues) {
                const payload = {
                    patientCaseId: caseData?.id || "",
                    stage: 0,
                    caseTypeId: group.caseTypeId,
                    notes: group.notes,
                    createdById: auth.user?.publicId || "",
                    role: auth.role || "",
                    teethNumbers: group.teethNumbers,
                };
                const res = await submitDiagnoses(payload);
                if (!res.success) throw new Error(res.message);
            }

            toast.success("Diagnosis plan submitted successfully!");
            setSubmitted(true);
            setTimeout(() => { setSubmitted(false); onClearAll(); }, 1800);
        } catch (error: any) {
            toast.error("Failed to submit: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col min-h-[420px] max-h-[620px] lg:max-h-[calc(100vh-250px)] overflow-hidden">

            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/60 dark:bg-slate-800/30">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40">
                        <ClipboardList size={14} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                            Diagnosis Plan
                        </h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {selected.length} {selected.length === 1 ? "tooth" : "teeth"} selected
                        </p>
                    </div>
                </div>

                {selected.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                        <Trash2 size={13} />
                        Clear all
                    </button>
                )}
            </div>

            {/* ── Body ── */}
            <div className="flex-1 overflow-y-auto patient-details-scrollbar p-4 space-y-3">
                <AnimatePresence mode="popLayout">
                    {selected.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center px-4 py-16"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center mb-4">
                                <ChevronDown size={22} className="text-indigo-400 dark:text-indigo-500" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                No teeth selected
                            </h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed max-w-[180px]">
                                Click any tooth on the chart to start building a plan
                            </p>
                        </motion.div>
                    ) : (
                        selected.map((selTooth) => {
                            const fdiNum = Number(selTooth.notations.fdi);
                            const toothData = teethMap.get(fdiNum) || ({ number: fdiNum, status: "healthy" } as ToothData);
                            return (
                                <motion.div
                                    key={fdiNum}
                                    layout
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <ToothDiagnosisCard
                                        selTooth={selTooth}
                                        toothData={toothData}
                                        onRemove={onRemoveTooth}
                                        onUpdate={onUpdateTooth}
                                    />
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            {selected.length > 0 && (
                <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/40 dark:bg-slate-800/20">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || submitted}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                            submitted
                                ? "bg-emerald-500 dark:bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/30"
                                : "bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white shadow-indigo-200 dark:shadow-indigo-900/40"
                        }`}
                    >
                        {submitted ? (
                            <>
                                <CheckCircle2 size={16} />
                                Submitted!
                            </>
                        ) : isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Submitting…
                            </>
                        ) : (
                            "Submit Diagnosis Plan"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}