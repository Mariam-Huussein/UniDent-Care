"use client";

import { motion } from "framer-motion";
import {
    User, Calendar, Activity, CheckCircle, Phone, MapPin,
    GraduationCap, Stethoscope, UserCircle,
    ClipboardList,
    BookUser,
} from "lucide-react";
import { PatientCase } from "../../../types/CaseDetails.types";
import { getPatientStatusConfig } from "../../../utils/CaseDetails.utils";
import ProgressTracker from "../Tracking/ProgressTracker";
import InfoCard from "../Shared/InfoCard";
import StudentActions from "./StudentActions";
import DoctorActions from "./DoctorActions/DoctorActions";
import { useCase } from "@/features/cases/context/CaseContext";
import { useEffect } from "react";

interface PatientInfoPanelProps {
    role: string | null;
    onRefetch: () => void;
}

export default function CaseInfoPanel({ role, onRefetch }: PatientInfoPanelProps) {
    const { caseData, creatorData, doctorOwnerData, studentOwnerData, refetchUserData, refetchSessions, refetchDoctorRequests } = useCase();
    const patient = caseData as PatientCase;
    const sc = getPatientStatusConfig(patient.status);
    useEffect(() => {
        refetchUserData();
        refetchSessions();
        refetchDoctorRequests();
    }, [refetchUserData, refetchSessions, refetchDoctorRequests]);

    const initials = patient.patientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-5"
        >
            {/* Patient Identity */}
            <div className="flex items-center gap-3.5">
                <div className={`shrink-0 w-12 h-12 rounded-2xl bg-linear-to-br ${sc.gradient} flex items-center justify-center shadow-lg dark:shadow-none`}>
                    <span className="text-white font-bold text-base">{initials}</span>
                </div>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight truncate">
                        {patient.patientName}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{patient.caseType} Case{patient.diagnosisdto?.diagnosisStage ? ` · ${patient.diagnosisdto.diagnosisStage}` : ''}</p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800/80" />

            {/* Description */}
            {patient.description && (
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">{patient.description}</p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={User} label="Age" value={`${patient.patientAge} years`} color="text-blue-500" />
                <InfoCard icon={Phone} label="Phone" value={patient.phone || "Not Provided"} color="text-emerald-500" />
                <InfoCard icon={MapPin} label="City" value={patient.city || "Not Provided"} color="text-rose-500" />
                <InfoCard icon={GraduationCap} label="University" value={patient.universityName || "Not Assigned"} color="text-indigo-500" />
                <InfoCard icon={Calendar} label="Created At" value={new Date(patient.createdAt).toLocaleDateString()} color="text-violet-500" />
                <InfoCard icon={ClipboardList} label="Total Sessions" value={`${patient.sessions}` || "0"} color="text-violet-500" />
                {
                    patient.createdByRole?.toLowerCase() !== "patient" && creatorData && (
                        <InfoCard icon={UserCircle} label="Created By" value={creatorData?.data?.fullName || "Unknown"} color="text-teal-500" />
                    )
                }
                {patient.assignedStudentId && studentOwnerData && (
                    <InfoCard icon={BookUser} label="Assigned Student" value={studentOwnerData?.data?.fullName || "Unknown"} color="text-cyan-500" />
                )}
                {patient.assignedDoctorId && doctorOwnerData && (
                    <InfoCard icon={Stethoscope} label="Supervising Doctor" value={doctorOwnerData?.data?.fullName || "Unknown"} color="text-cyan-500" />
                )}
            </div>

            {/* Treatment Progress */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <ProgressTracker currentStep={patient.progressStep} processStatus={patient.processStatus} />
            </div>
            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-6" />

            {/* Role-Based Actions */}
            {patient.userFlags?.isAssignedStudent && role === "Student" && (
                <StudentActions patient={patient} onRefetch={onRefetch} />
            )}

            {patient.userFlags?.isAssignedDoctor && role === "Doctor" && (
                <DoctorActions patient={patient} onRefetch={onRefetch} />
            )}


            {/* Completed */}
            {patient.status === "Completed" && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/50 p-4 space-y-2">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-500" />
                            Treatment Completed
                        </p>
                        {patient.completedAt && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-500">
                                {new Date(patient.completedAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}