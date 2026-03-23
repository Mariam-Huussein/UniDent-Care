"use client";

import { ArrowLeft, Phone, StickyNote, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PatientCase } from "../../types/patientDetails.types";
import { getPatientStatusConfig } from "../../utils/patientDetails.utils";

interface PatientHeaderProps {
    patient: PatientCase;
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
    const router = useRouter();
    const statusConfig = getPatientStatusConfig(patient.status);

    const initials = patient.patientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
        >
            {/* Top row: Back + Status */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={() => router.back()}
                    className="my-btn-outline !flex-none w-10 h-10"
                    aria-label="Go back"
                >
                    <ArrowLeft size={18} />
                </button>

                <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                >
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
                    {statusConfig.label}
                </motion.span>
            </div>

            {/* Patient info */}
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg sm:text-xl">{initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
                        {patient.patientName}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                        {patient.patientAge > 0 && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <User size={14} className="text-gray-400" />
                                {patient.patientAge} years
                            </span>
                        )}
                        {patient.patientPhone && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <Phone size={14} className="text-gray-400" />
                                {patient.patientPhone}
                            </span>
                        )}
                        {patient.caseType && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                <StickyNote size={14} className="text-gray-400" />
                                {patient.caseType}
                            </span>
                        )}
                    </div>

                    {patient.patientNotes && (
                        <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {patient.patientNotes}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
