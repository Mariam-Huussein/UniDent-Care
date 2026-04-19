"use client";

import { PiTooth } from "react-icons/pi";
import { Clock12, Mars, User, Venus } from "lucide-react";
import { CaseCardProps } from "../../types/caseCardProps.types";
import { timeAgo } from "../../utils/caseCard.utils";

interface CaseContentProps {
    caseItem: CaseCardProps["caseItem"];
}

const getGenderLabel = (gender?: 0 | 1): string => {
    if (gender === 0) return "Male";
    if (gender === 1) return "Female";
    return "Unknown";
};

export default function CaseContent({ caseItem }: CaseContentProps) {
    return (
        <div className="flex flex-col gap-2">
            {/* Title & Time */}
            <div className="flex items-center justify-between">
                <h3 className="text-[15px] sm:text-base font-bold text-gray-900 dark:text-slate-100 truncate leading-tight transition-colors">
                    {caseItem.patientName}
                </h3>
                <span className="inline-flex items-center text-xs gap-1">
                    <Clock12 size={16} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                    <span className="font-medium text-gray-500 dark:text-slate-400 transition-colors">{timeAgo(caseItem.createAt)}</span>
                </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-1 line-clamp-2 transition-colors">
                {caseItem.caseType?.name || "No description provided."}
            </p>

            {/* Detail chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                    <PiTooth size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                    <span className="font-medium">{caseItem.diagnosisdto?.map((diagnosis) => diagnosis.caseType).join(", ") || "Uncategorized"}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                    <User size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                    <span className="font-medium">{caseItem.patientAge} Yrs</span>
                </div>

                {caseItem.gender !== undefined && (
                    <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded-md transition-colors">
                        {
                            caseItem.gender === 0 ? (
                                <Mars size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                            ) : caseItem.gender === 1 ? (
                                <Venus size={14} className="text-indigo-500 dark:text-indigo-400 transition-colors" />
                            ) : null
                        }
                        <span className="font-medium">{getGenderLabel(caseItem.gender)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
