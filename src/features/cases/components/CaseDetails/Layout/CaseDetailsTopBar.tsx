"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CaseStatus } from "../../../types/CaseDetails.types";
import { getPatientStatusConfig } from "../../../utils/CaseDetails.utils";
import { useCase } from "@/features/cases/context/CaseContext";

interface CaseDetailsTopBarProps {
    currentStatus: CaseStatus;
    patientName: string;
}

export default function CaseDetailsTopBar({ currentStatus, patientName }: CaseDetailsTopBarProps) {
    const router = useRouter();
    const cfg = getPatientStatusConfig(currentStatus);
    const {caseData} = useCase();
    return (
        <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-md transition-all cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft size={17} />
                </motion.button>
                <div>
                    <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight">{patientName}'s Case Details</h1>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Case lifecycle view</p>
                </div>
            </div>

            {/* Status Badge */}
            <span className={`inline-flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl ${cfg.bg} ${cfg.text} tracking-wide uppercase shadow-sm border ${cfg.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                {cfg.label}
            </span>
        </motion.div>
    );
}
