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
        case "healthy": return "Healthy";
        case "needs-treatment": return "Needs Treatment";
        case "in-progress": return "In Progress";
        case "treated": return "Treated";
        default: return "Healthy";
    }
};

const displayToStatus = (display: string): ToothStatus => {
    switch (display) {
        case "Healthy": return "healthy";
        case "Needs Treatment": return "needs-treatment";
        case "In Progress": return "in-progress";
        case "Treated": return "treated";
        default: return "healthy";
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
        <div className="bg-white dark:bg-slate-800/50 border text-left border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-md flex items-center justify-center border shadow-sm shrink-0"
                        style={{ background: colors.fill, borderColor: colors.stroke }}
                    >
                        <span
                            className="text-xs font-bold"
                            style={{ color: colors.stroke }}
                        >
                            {fdiNum}
                        </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Tooth #{fdiNum}
                    </span>
                </div>
                <button
                    onClick={() => onRemove(fdiNum)}
                    className="text-[10px] text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Status Select */}
            <div className="space-y-3">
                <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                        Status
                    </label>
                    <SelectItems
                        value={statusToDisplay(t.status)}
                        onChange={(val) =>
                            onUpdate(fdiNum, { status: displayToStatus(val) })
                        }
                        options={STATUS_OPTIONS}
                        placeholder="Select Status"
                    />
                </div>

                {/* Extra fields for unhealthy teeth */}
                {t.status !== "healthy" && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", transitionEnd: { overflow: "visible" } }}
                        style={{ overflow: "hidden" }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                    >
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Treatment Type
                            </label>
                            <div className="w-full">
                                <CaseTypeDropdown
                                    selectedCaseType={t.treatmentType || ""}
                                    setSelectedCaseType={(val) =>
                                        onUpdate(fdiNum, { treatmentType: val })
                                    }
                                    onCaseTypeSelect={(name, id) =>
                                        onUpdate(fdiNum, { treatmentType: name, caseTypeId: id })
                                    }
                                    placeholder="Select Treatment Type"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                Clinical Notes
                            </label>
                            <textarea
                                placeholder="Add specific details, surfaces (e.g. MOD), or observations..."
                                rows={2}
                                className="w-full text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                value={t.notes || ""}
                                onChange={(e) =>
                                    onUpdate(fdiNum, { notes: e.target.value })
                                }
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}