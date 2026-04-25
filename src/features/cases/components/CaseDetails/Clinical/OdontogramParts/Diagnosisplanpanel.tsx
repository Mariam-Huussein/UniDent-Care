"use client";

import { useState } from "react";
import { ToothData } from "@/features/cases/types/CaseDetails.types";
import { Info, Trash, Loader2 } from "lucide-react";
import type { ToothDetail } from "react-odontogram";
import ToothDiagnosisCard from "./Toothdiagnosiscard";
import { useCase } from "@/features/cases/context/CaseContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { submitDiagnoses } from "@/features/cases/server/diagnoses.action";

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
                        groups[key] = {
                            caseTypeId: toothData.caseTypeId,
                            notes: toothData.notes || "",
                            teethNumbers: []
                        };
                    }
                    groups[key].teethNumbers.push(fdiNum);
                }
            }

            const groupValues = Object.values(groups);
            
            if (groupValues.length === 0) {
                alert("Please select a treatment type for the unhealthy teeth before submitting.");
                setIsSubmitting(false);
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
                    teethNumbers: group.teethNumbers
                };

                const res = await submitDiagnoses(payload);
                if (!res.success) {
                    throw new Error(res.message);
                }
            }

            alert("Diagnosis plan submitted successfully!");
            onClearAll();
        } catch (error: any) {
            console.error(error);
            alert("Failed to submit diagnosis plan: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col min-h-[400px] max-h-[600px] lg:max-h-[calc(100vh-250px)]">
            {/* Panel Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                        Diagnosis Plan
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Selected teeth: {selected.length}
                    </p>
                </div>
                {selected.length > 0 && (
                    <button
                        onClick={onClearAll}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 font-medium rounded-xl"
                    >
                        <Trash size={18} />
                    </button>
                )}
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto patient-details-scrollbar pr-1 space-y-4 pb-32">
                {selected.length === 0 ? (
                    <EmptySelectionPlaceholder />
                ) : (
                    selected.map((selTooth) => {
                        const fdiNum = Number(selTooth.notations.fdi);
                        const toothData =
                            teethMap.get(fdiNum) ||
                            ({ number: fdiNum, status: "healthy" } as ToothData);

                        return (
                            <ToothDiagnosisCard
                                key={fdiNum}
                                selTooth={selTooth}
                                toothData={toothData}
                                onRemove={onRemoveTooth}
                                onUpdate={onUpdateTooth}
                            />
                        );
                    })
                )}
            </div>

            {/* Panel Footer */}
            {selected.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-800 text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-indigo-500/20"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Submitting...
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

function EmptySelectionPlaceholder() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                <Info size={20} className="text-indigo-400 dark:text-indigo-500" />
            </div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No teeth selected
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                Click on the chart to select teeth and formulate a diagnosis plan.
            </p>
        </div>
    );
}