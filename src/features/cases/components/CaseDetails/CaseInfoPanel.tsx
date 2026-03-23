"use client";

import { motion } from "framer-motion";
import { User, Phone, Calendar, HandHelping, Sparkles, MessageCircle, Activity, CheckCircle, Zap, AlertTriangle, ClipboardList, Info, MapPin } from "lucide-react";
import { PatientCase } from "../../types/CaseDetails.types";
import { getPatientStatusConfig, getUrgencyConfig } from "../../utils/CaseDetails.utils";
import ProgressTracker from "./ProgressTracker";
import StudentCard from "./StudentCard";
import InfoCard from "./InfoCard";

interface PatientInfoPanelProps {
    patient: PatientCase;
}

const URGENCY_ICONS: Record<string, React.ElementType> = {
    zap: Zap,
    'alert-triangle': AlertTriangle,
    sparkles: Sparkles,
    'clipboard-list': ClipboardList,
    info: Info,
};

export default function CaseInfoPanel({ patient }: PatientInfoPanelProps) {
    const sc = getPatientStatusConfig(patient.status);
    const urgency = patient.urgencyTag ? getUrgencyConfig(patient.urgencyTag) : null;

    const isCurrentStudent = patient.student?.id === 'student-0001';

    const initials = patient.patientName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const UrgencyIcon = urgency ? URGENCY_ICONS[urgency.icon] || Info : null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-5"
        >
            {/* Status + Urgency */}
            <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-2 text-[11px] font-bold px-3 py-1.5 rounded-full ${sc.bg} ${sc.text} tracking-wide uppercase`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                    {sc.label}
                </span>
                {urgency && UrgencyIcon && (
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${urgency.bg} ${urgency.text} ${urgency.border}`}>
                        <UrgencyIcon size={12} />
                        {urgency.label}
                    </span>
                )}
            </div>

            {/* Patient Identity */}
            <div className="flex items-center gap-3.5">
                <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${sc.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-base">{initials}</span>
                </div>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
                        {patient.patientName}
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">{patient.caseType} Case</p>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Notes */}
            <p className="text-[13px] text-gray-600 leading-relaxed">{patient.patientNotes}</p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={User} label="Age" value={`${patient.patientAge} years`} color="text-blue-500" />
                <InfoCard
                    icon={Activity}
                    label="Status"
                    value={patient.status === 'unassigned' ? 'Available' : 'Under Treatment'}
                    color="text-amber-500"
                />
                <InfoCard icon={MapPin} label="City" value={patient.patientCity} color="text-rose-500" />
                <InfoCard icon={Calendar} label="Created At" value={new Date(patient.createdAt).toLocaleDateString()} color="text-violet-500" />
                <InfoCard icon={Phone} label="Phone" value={patient.patientPhone} color="text-emerald-500" />
                <InfoCard icon={MessageCircle} label="WhatsApp" value={patient.patientPhone} color="text-emerald-500" />
            </div>

            {/* Treatment Progress */}
            <div className="mt-8 pt-6 border-t border-gray-100">
                <ProgressTracker currentStep={patient.progressStep} />
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />

            {/* ── Status-specific CTAs ── */}

            {patient.status === "unassigned" && (
                <div className="flex gap-3">
                    <button className="my-btn flex-1 py-3 group">
                        <HandHelping size={15} className="group-hover:scale-110 transition-transform" />
                        Take Case
                    </button>
                    <button className="my-btn-outline flex-1 py-3 group">
                        <Sparkles size={15} className="group-hover:rotate-12 transition-transform" />
                        Request Diagnosis
                    </button>
                </div>
            )}

            {patient.status === "diagnosis" && patient.student && (
                <div className="space-y-4">
                    <StudentCard student={patient.student} status="diagnosis" />
                </div>
            )}

            {patient.status === "in-progress" && (
                <div className="space-y-3">
                    {/* Student info (Show only if NOT current student) */}
                    {patient.student && !isCurrentStudent && (
                        <StudentCard student={patient.student} status="in-progress" />
                    )}

                    {/* Next Session */}
                    {patient.sessions.find((s) => s.isNext) && (() => {
                        const next = patient.sessions.find((s) => s.isNext)!;
                        return (
                            <div className="rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/40 border border-amber-100/60 p-4 space-y-2 backdrop-blur-sm">
                                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar size={12} /> Next Session
                                </p>
                                <p className="text-sm text-gray-700 font-medium">{next.description}</p>
                                <div className="flex gap-2">
                                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                                        {new Date(next.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </span>
                                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                                        {next.time}
                                    </span>
                                </div>
                            </div>
                        );
                    })()}
                    {isCurrentStudent ? (
                        <button className="my-btn w-full py-3 group">
                            <Activity size={15} className="group-hover:scale-110 transition-transform" /> Start Session
                        </button>
                    ) : (
                        <button className="my-btn w-full py-3 group opacity-70 cursor-not-allowed">
                            <Activity size={15} /> In session by {patient.student?.name}
                        </button>
                    )}
                </div>
            )}

            {patient.status === "completed" && (
                <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-100/60 p-4 space-y-2">
                        <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                            <CheckCircle size={16} className="text-emerald-600" />
                            Treatment Completed
                        </p>
                        {patient.completedAt && (
                            <p className="text-xs text-emerald-600">
                                {new Date(patient.completedAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                            </p>
                        )}
                    </div>
                    {patient.student && (
                        <StudentCard student={patient.student} status="completed" />
                    )}
                </div>
            )}
        </motion.div>
    );
}