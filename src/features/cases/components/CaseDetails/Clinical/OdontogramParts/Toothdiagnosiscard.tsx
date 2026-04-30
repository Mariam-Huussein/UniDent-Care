"use client";

import { ToothData } from "@/features/cases/types/CaseDetails.types";
import { getToothStatusColor } from "@/features/cases/utils/CaseDetails.utils";
import { motion } from "framer-motion";
import type { ToothDetail } from "react-odontogram";
import SelectItems from "@/components/common/SelectItems";
import CaseTypeDropdown from "@/features/cases/components/AvailableCases/CaseTypeDropdown";
import { X } from "lucide-react";

type ToothStatus = ToothData["status"];

interface ToothDiagnosisCardProps {
    selTooth: ToothDetail;
    toothData: ToothData;
    onRemove: (fdiNum: number) => void;
    onUpdate: (num: number, updates: Partial<ToothData>) => void;
}

const STATUS_OPTIONS = ["Healthy", "Needs Treatment", "In Progress", "Treated"];

const statusToDisplay = (status: string) => {
    switch (status) {
        case "healthy":         return "Healthy";
        case "needs-treatment": return "Needs Treatment";
        case "in-progress":     return "In Progress";
        case "treated":         return "Treated";
        default:                return "Healthy";
    }
};

const displayToStatus = (display: string): ToothStatus => {
    switch (display) {
        case "Healthy":          return "healthy";
        case "Needs Treatment":  return "needs-treatment";
        case "In Progress":      return "in-progress";
        case "Treated":          return "treated";
        default:                 return "healthy";
    }
};

export default function ToothDiagnosisCard({
    selTooth,
    toothData,
    onRemove,
    onUpdate,
}: ToothDiagnosisCardProps) {
    const fdiNum = Number(selTooth.notations.fdi);
    const t = toothData;
    const colors = getToothStatusColor(t.status);

    return (
        <div className="bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-xl overflow-hidden shadow-sm hover:border-indigo-200 dark:hover:border-indigo-700/50 hover:shadow-md transition-all duration-200">
            {/* Card accent stripe + header */}
            <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(to right, ${colors.stroke}90, ${colors.stroke}30)` }}
            />
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center border-2 shadow-sm shrink-0"
                            style={{ background: colors.fill, borderColor: colors.stroke }}
                        >
                            <span className="text-xs font-extrabold" style={{ color: colors.stroke }}>
                                {fdiNum}
                            </span>
                        </div>
                        <div>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Tooth #{fdiNum}
                            </span>
                            <p
                                className="text-[10px] font-semibold mt-0.5"
                                style={{ color: colors.stroke }}
                            >
                                {colors.label}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onRemove(fdiNum)}
                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Status Select */}
                <div className="space-y-3">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                            Status
                        </label>
                        <SelectItems
                            value={statusToDisplay(t.status)}
                            onChange={(val) => onUpdate(fdiNum, { status: displayToStatus(val) })}
                            options={STATUS_OPTIONS}
                            placeholder="Select Status"
                        />
                    </div>

                    {t.status !== "healthy" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto", transitionEnd: { overflow: "visible" } }}
                            style={{ overflow: "hidden" }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                        >
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                                    Treatment Type
                                </label>
                                <CaseTypeDropdown
                                    selectedCaseType={t.treatmentType || ""}
                                    setSelectedCaseType={(val) => onUpdate(fdiNum, { treatmentType: val })}
                                    onCaseTypeSelect={(name, id) => onUpdate(fdiNum, { treatmentType: name, caseTypeId: id })}
                                    placeholder="Select Treatment Type"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                                    Clinical Notes
                                </label>
                                <textarea
                                    placeholder="Surfaces, observations, e.g. MOD caries on buccal…"
                                    rows={2}
                                    className="w-full text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-900/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-600 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    value={t.notes || ""}
                                    onChange={(e) => onUpdate(fdiNum, { notes: e.target.value })}
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}