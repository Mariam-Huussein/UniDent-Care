"use client";

import { ToothStatus } from "@/features/cases/types/CaseDetails.types";
import { getToothStatusColor } from "@/features/cases/utils/CaseDetails.utils";
import { Eye, Pencil } from "lucide-react";

interface OdontogramHeaderProps {
    readonly: boolean;
}

const TOOTH_STATUSES: ToothStatus[] = ["healthy", "needs-treatment", "in-progress", "treated"];

export default function OdontogramHeader({ readonly }: OdontogramHeaderProps) {
    return (
        <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Title */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40">
                    {readonly
                        ? <Eye size={16} className="text-white" />
                        : <Pencil size={16} className="text-white" />
                    }
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">
                        {readonly ? "Dental Chart" : "Interactive Odontogram"}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {readonly
                            ? "Click any tooth to view diagnosis info"
                            : "Select teeth to build a diagnosis plan"}
                    </p>
                </div>
            </div>

            {/* Legend pills */}
            {/* <div className="flex items-center gap-2.5 flex-wrap">
                {TOOTH_STATUSES.map((status) => {
                    const c = getToothStatusColor(status);
                    return (
                        <div
                            key={status}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold"
                            style={{
                                background: c.fill + "33",
                                borderColor: c.stroke + "66",
                                color: c.stroke,
                            }}
                        >
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: c.stroke }}
                            />
                            {c.label}
                        </div>
                    );
                })}
            </div> */}
        </div>
    );
}