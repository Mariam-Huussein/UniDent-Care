"use client";

import { PiTooth } from "react-icons/pi";
import { Clock12, Send, User } from "lucide-react";
import { CaseCardProps } from "../../types/caseCardProps.types";
import { timeAgo } from "../../utils/caseCard.utils";

interface CaseContentProps {
    caseItem: CaseCardProps["caseItem"];
}

export default function CaseContent({ caseItem }: CaseContentProps) {
    return (
        <div className="flex flex-col gap-2">
            {/* Title & Time */}
            <div className="flex items-center justify-between">
                <h3 className="text-[15px] sm:text-base font-bold text-gray-900 truncate leading-tight">
                    {caseItem.patientName}
                </h3>
                <span className="inline-flex items-center text-xs gap-1">
                    <Clock12 size={16} className="text-indigo-500" />
                    <span className="font-medium text-gray-500">{timeAgo(caseItem.createAt)}</span>
                </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 mb-1 line-clamp-2">
                {caseItem.caseType?.description || "No description provided."}
            </p>

            {/* Detail chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    <PiTooth size={14} className="text-blue-400" />
                    <span className="font-medium">{caseItem.caseType?.name || "Uncategorized"}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    <User size={14} className="text-blue-400" />
                    <span className="font-medium">{caseItem.patientAge} Yrs</span>
                </div>

                {/* Pending requests */}
                <div className="inline-flex items-center gap-1 text-[14px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    {caseItem.pendingRequests > 0 ? (
                        <>
                            <Send size={14} className="text-red-400" />
                            <span className="font-medium">{caseItem.pendingRequests} Request{caseItem.pendingRequests !== 1 ? "s" : ""}</span>
                        </>
                    )
                        :
                        (
                            <>
                                <Send size={14} className="text-green-400" />
                                <span className="font-medium">0 Request</span>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
