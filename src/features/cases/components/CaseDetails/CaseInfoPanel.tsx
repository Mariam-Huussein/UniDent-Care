"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import { motion } from "framer-motion";
import { User, Phone, Calendar, MessageCircle, Activity, CheckCircle, MapPin, Send } from "lucide-react";
import { PatientCase } from "../../types/CaseDetails.types";
import { getPatientStatusConfig } from "../../utils/CaseDetails.utils";
import ProgressTracker from "./ProgressTracker";
import StudentCard from "./StudentCard";
import InfoCard from "./InfoCard";
import SendRequestModal from "../CaseCard/SendRequestModal";

interface PatientInfoPanelProps {
    patient: PatientCase;
    role: string | null;
}

export default function CaseInfoPanel({ patient, role }: PatientInfoPanelProps) {
    const sc = getPatientStatusConfig(patient.status);
    const [showRequestModal, setShowRequestModal] = useState(false);

    const currentUserId = useSelector((state: RootState) => state.auth.user?.publicId || "");
    const isCurrentStudent = role === "Student" && patient.student?.id === currentUserId;
    const isDoctor = role === "Doctor";

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
                <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${sc.gradient} flex items-center justify-center shadow-lg dark:shadow-none`}>
                    <span className="text-white font-bold text-base">{initials}</span>
                </div>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight truncate">
                        {patient.patientName}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{patient.caseType} Case</p>
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
                <InfoCard
                    icon={Activity}
                    label="Status"
                    value={patient.status === 'unassigned' ? 'Available' : 'Under Treatment'}
                    color="text-amber-500"
                />
                <InfoCard icon={MapPin} label="City" value={patient.patientCity || "Not Provided"} color="text-rose-500" />
                <InfoCard icon={Calendar} label="Created At" value={new Date(patient.createdAt).toLocaleDateString()} color="text-violet-500" />
                <InfoCard icon={Phone} label="Phone" value={patient.patientPhone || "Not Provided"} color="text-emerald-500" />
                <InfoCard icon={MessageCircle} label="WhatsApp" value={patient.patientPhone || "Not Provided"} color="text-emerald-500" />
            </div>

            {/* Treatment Progress */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                <ProgressTracker currentStep={patient.progressStep} />
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800/80 my-6" />

            {/* ── Status-specific CTAs ── */}

            {patient.status === "unassigned" && role === "Student" && (
                <div className="flex gap-3">
                    <button onClick={() => setShowRequestModal(true)} className="my-btn flex-1 py-3 group">
                        <Send size={15} className="group-hover:scale-110 transition-transform" />
                        Request Take Case
                    </button>
                </div>
            )}

            {/* Send Request Modal */}
            {showRequestModal && (
                <SendRequestModal
                    caseId={patient.id}
                    patientName={patient.patientName}
                    caseType={patient.caseType}
                    onClose={() => setShowRequestModal(false)}
                />
            )}

            {/* ── Diagnosis: show assigned student card (Doctor sees it, Student sees if it's them) ── */}
            {patient.status === "diagnosis" && patient.student && (isDoctor || isCurrentStudent) && (
                <div className="space-y-4">
                    <StudentCard student={patient.student} status="diagnosis" />
                </div>
            )}

            {/* ── In Progress ── */}
            {patient.status === "in-progress" && (
                <div className="space-y-3">
                    {patient.student && (isDoctor || !isCurrentStudent) && (
                        <StudentCard student={patient.student} status="in-progress" />
                    )}

                    {/* Next Session */}
                    {patient.sessions.find((s) => s.isNext) && (() => {
                        const next = patient.sessions.find((s) => s.isNext)!;
                        return (
                            <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/50 p-4 space-y-2 backdrop-blur-sm">
                                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar size={12} /> Next Session
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{next.description}</p>
                                <div className="flex gap-2">
                                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                                        {new Date(next.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </span>
                                    <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                                        {next.time}
                                    </span>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Start Session button */}
                    {isCurrentStudent && (
                        <button className="my-btn w-full py-3 group">
                            <Activity size={15} className="group-hover:scale-110 transition-transform" /> Start Session
                        </button>
                    )}
                </div>
            )}

            {/* ── Completed ── */}
            {patient.status === "completed" && (
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
                    {/* Doctor sees the student who treated the case */}
                    {patient.student && isDoctor && (
                        <StudentCard student={patient.student} status="completed" />
                    )}
                </div>
            )}
        </motion.div>
    );
}