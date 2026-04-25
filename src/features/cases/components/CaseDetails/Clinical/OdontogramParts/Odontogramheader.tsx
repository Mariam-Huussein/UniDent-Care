"use client";

import { ToothStatus } from "@/features/cases/types/CaseDetails.types";
import { getToothStatusColor } from "@/features/cases/utils/CaseDetails.utils";
import { Info } from "lucide-react";

interface OdontogramHeaderProps {
    readonly: boolean;
}

const TOOTH_STATUSES: ToothStatus[] = ["healthy", "needs-treatment", "in-progress", "treated"];

export default function OdontogramHeader({ readonly }: OdontogramHeaderProps) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Title */}
            <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Info size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                        {readonly ? "Diagnosis Chart" : "Interactive Odontogram"}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {readonly
                            ? "Chart is view-only prior to diagnosis"
                            : "Click any tooth for details"}
                    </p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
                {TOOTH_STATUSES.map((status) => {
                    const c = getToothStatusColor(status);
                    return (
                        <div key={status} className="flex items-center gap-1.5">
                            <div
                                className="w-3.5 h-3.5 rounded border shadow-sm"
                                style={{ background: c.fill, borderColor: c.stroke }}
                            />
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {c.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}