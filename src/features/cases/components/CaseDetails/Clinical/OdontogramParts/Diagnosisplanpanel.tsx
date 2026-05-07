"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToothData } from "@/features/cases/types/CaseDetails.types";
import { ClipboardList, Trash2, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import type { ToothDetail } from "react-odontogram";
import ToothDiagnosisCard from "./Toothdiagnosiscard";
import { useCase } from "@/features/cases/context/CaseContext";
import { submitDiagnoses, updateDiagnosis, deleteDiagnosis } from "@/features/cases/server/diagnoses.action";
import toast from "react-hot-toast";
import { getUserDetailsFromCookies } from "@/utils/sharedHelper";
import { useLanguage } from "@/components/providers/LanguageProvider";

export interface DiagnosisPlanPanelProps {
    selected: ToothDetail[];
    teethMap: Map<number, ToothData>;
    onRemoveTooth: (fdiNum: number) => void;
    onUpdateTooth: (num: number, updates: Partial<ToothData>) => void;
    onSubmitSuccess: () => void | Promise<void>;
}

export default function DiagnosisPlanPanel({
    selected,
    teethMap,
    onRemoveTooth,
    onUpdateTooth,
    onSubmitSuccess,
}: DiagnosisPlanPanelProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { caseData } = useCase();
    const { t } = useLanguage();

    const handleSubmit = async () => {
        if (selected.length === 0) return;
        setIsSubmitting(true);
        const { userId, userRole } = getUserDetailsFromCookies();
        try {
            const selTooth = selected[0];
            const fdiNum = Number(selTooth.notations.fdi);
            const toothData = teethMap.get(fdiNum);
            if (!toothData) {
                throw new Error("Tooth data not found");
            }

            if (toothData.status === "healthy" && toothData.id) {
                const res = await deleteDiagnosis(toothData.id);
                if (!res.success) throw new Error(res.message);
            } else if (toothData.status !== "healthy" && toothData.id && toothData.caseTypeId) {
                const payload = {
                    id: toothData.id,
                    stage: 1,
                    caseTypeId: toothData.caseTypeId,
                    notes: toothData.notes || "",
                    teethNumbers: [fdiNum]
                };
                const res = await updateDiagnosis(payload);
                if (!res.success) throw new Error(res.message);
            } else if (toothData.status !== "healthy" && !toothData.id && toothData.caseTypeId) {
                const payload = {
                    patientCaseId: caseData?.id || "",
                    stage: 1,
                    caseTypeId: toothData.caseTypeId,
                    notes: toothData.notes || "",
                    createdById: userId || "",
                    role: userRole || "",
                    teethNumbers: [fdiNum]
                };
                const res = await submitDiagnoses(payload);
                if (!res.success) throw new Error(res.message);
            }

            toast.success(t.diagnosisSaved);
            setSubmitted(true);
            await onSubmitSuccess();

            setTimeout(() => { setSubmitted(false); }, 1800);
        } catch (error: any) {
            toast.error(t.diagnosisFailed + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-2xl flex flex-col h-auto overflow-visible relative">
            {/* ── Header ── */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/60 dark:bg-slate-800/30">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-indigo-900/40">
                        <ClipboardList size={14} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                            {t.diagnosisPlanTitle}
                        </h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {selected.length === 1 ? t.diagnosisOneTooth : t.diagnosisNoTooth}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="p-5 space-y-5 h-auto overflow-visible">
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
                                {t.diagnosisNoTeethTitle}
                            </h4>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed max-w-[180px]">
                                {t.diagnosisNoTeethDesc}
                            </p>
                        </motion.div>
                    ) : (
                        (() => {
                            const selTooth = selected[0];
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
                                    className="overflow-visible"
                                >
                                    <ToothDiagnosisCard
                                        selTooth={selTooth}
                                        toothData={toothData}
                                        onRemove={onRemoveTooth}
                                        onUpdate={onUpdateTooth}
                                    />
                                </motion.div>
                            );
                        })()
                    )}
                </AnimatePresence>
            </div>

            {/* ── Footer ── */}
            {selected.length > 0 && (
                <div className="px-5 py-5 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/40 dark:bg-slate-800/20 mt-auto rounded-b-2xl">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || submitted}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${submitted
                            ? "bg-emerald-500 dark:bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/30"
                            : "bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white shadow-indigo-200 dark:shadow-indigo-900/40"
                            }`}
                    >
                        {submitted ? (
                            <>
                                <CheckCircle2 size={16} />
                                {t.diagnosisSubmitted}
                            </>
                        ) : isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {t.diagnosisSubmitting}
                            </>
                        ) : (
                            t.diagnosisSubmitBtn
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
