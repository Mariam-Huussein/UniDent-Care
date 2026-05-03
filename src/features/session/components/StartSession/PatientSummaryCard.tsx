"use client";

import { motion } from "framer-motion";
import {
    User, GraduationCap, Stethoscope,
    FileText,
} from "lucide-react";
import { PatientCase } from "@/features/cases/types/CaseDetails.types";
import InfoCard from "@/features/cases/components/CaseDetails/Shared/InfoCard";
import { useCase } from "@/features/cases/context/CaseContext";
import ProgressTracker from "@/features/cases/components/CaseDetails/Layout/ProgressTracker";

interface PatientSummaryCardProps {
    patient: PatientCase;
}

export default function PatientSummaryCard({ patient }: PatientSummaryCardProps) {
    const initials = patient.patientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const { caseData, doctorOwnerData, } = useCase()

    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-5 sm:p-6 space-y-5 transition-colors duration-300"
        >
            {/* Patient Identity */}
            <div className="flex items-center gap-3.5">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg dark:shadow-none">
                    <span className="text-white font-bold text-base">{initials}</span>
                </div>
                <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight truncate">
                        {caseData?.patientName}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {caseData?.diagnosisdto?.[0]?.caseTypeName} Case
                        {caseData?.diagnosisdto?.[0]?.stage ? ` · ${caseData.diagnosisdto[0].stage}` : ""}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800/80" />

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={User} label="Age" value={`${caseData?.patientAge} years`} color="text-blue-500" />
                <InfoCard icon={GraduationCap} label="University" value={caseData?.universityName || "Not Assigned"} color="text-indigo-500" />
                <InfoCard icon={FileText} label="Sessions" value={`${caseData?.totalSessions}`} color="text-emerald-500" />
                <InfoCard icon={Stethoscope} label="Supervising Doctor" value={doctorOwnerData?.data?.fullName || "Unknown"} color="text-cyan-500" />
            </div>

            {/* Treatment Progress */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <ProgressTracker status={patient?.status} createdByRole={patient?.createdByRole} diagnosisdto={patient?.diagnosisdto} />
            </div>
        </motion.div>
    );
}
