"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStatusConfig } from "../../utils/caseCard.utils";

interface CaseDetailHeaderProps {
    patientName: string;
    status: string;
}

export default function CaseDetailHeader({ patientName, status }: CaseDetailHeaderProps) {
    const router = useRouter();
    const statusConfig = getStatusConfig(status);

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push("/cases")}
                    className="my-btn-outline w-10 h-10"
                    aria-label="Back to cases"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        {patientName}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">Case Details</p>
                </div>
            </div>

            <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                {statusConfig.label}
            </span>
        </div>
    );
}
