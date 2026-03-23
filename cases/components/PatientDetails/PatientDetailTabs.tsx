"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaseStatus, PatientCase } from "../../types/patientDetails.types";
import Odontogram from "./Odontogram";
import ActivityTimeline from "./ActivityTimeline";
import ProgressTracker from "./ProgressTracker";
import { Stethoscope } from "lucide-react";

interface PatientDetailTabsProps {
    patient: PatientCase;
}

type TabDef = { key: string; label: string };

function getTabsForStatus(status: CaseStatus): TabDef[] {
    switch (status) {
        case "unassigned":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "notes", label: "Patient Notes" },
            ];
        case "diagnosis":
            return [
                { key: "odontogram", label: "Odontogram" },
            ];
        case "in-progress":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "progress", label: "Progress" },
                { key: "timeline", label: "Timeline" },
            ];
        case "completed":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "summary", label: "Treatment Summary" },
                { key: "beforeAfter", label: "Before & After" },
                { key: "timeline", label: "Timeline" },
                { key: "feedback", label: "Feedback" },
            ];
    }
}

export default function PatientDetailTabs({ patient }: PatientDetailTabsProps) {
    const tabs = getTabsForStatus(patient.status);
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    // Reset tab when status changes
    useEffect(() => {
        setActiveTab(getTabsForStatus(patient.status)[0].key);
    }, [patient.status]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="relative rounded-2xl bg-white/80 border border-gray-100/80 shadow-sm shadow-gray-100/50"
        >
            {/* Background with blur separated to prevent tooltip stacking context issues */}
            <div className="absolute inset-0 backdrop-blur-md rounded-2xl -z-10" />

            <div className="relative z-10 overflow-hidden rounded-2xl">
                {/* Tab Headers */}
                <div className="flex border-b border-gray-100/80 overflow-x-auto patient-details-scrollbar px-1">
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`relative px-5 py-4 text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === key
                                ? "text-gray-900"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {label}
                            {activeTab === key && (
                                <motion.div
                                    layoutId="pd-tab-indicator"
                                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-5 sm:p-7">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "details" && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-800 mb-2">Case Description</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{patient.patientNotes}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <DetailCard label="Case Type" value={patient.caseType} />
                                        <DetailCard label="Patient Age" value={`${patient.patientAge} years`} />
                                        <DetailCard label="Phone" value={patient.patientPhone} />
                                        <DetailCard label="City" value={patient.patientCity} />
                                        <DetailCard
                                            label="Created"
                                            value={new Date(patient.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "notes" && (
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-3">Patient Notes</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{patient.patientNotes || "No notes available."}</p>
                                </div>
                            )}

                            {activeTab === "student" && patient.student && (
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-4">Assigned Student</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <DetailCard label="Name" value={patient.student.name} />
                                        <DetailCard label="University" value={patient.student.university} />
                                        <DetailCard label="Level" value={`Level ${patient.student.level}`} />
                                        <DetailCard label="Phone" value={patient.student.phone} />
                                        <DetailCard label="Email" value={patient.student.email} />
                                    </div>
                                </div>
                            )}

                            {activeTab === "odontogram" && <Odontogram teeth={patient.teeth} readonly={patient.status === "unassigned"} status={patient.status} />}
                            {activeTab === "progress" && <ProgressTracker currentStep={patient.progressStep} />}
                            {activeTab === "timeline" && <ActivityTimeline events={patient.timeline} />}

                            {activeTab === "summary" && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-800 mb-2">Treatment Summary</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{patient.treatmentSummary || "No summary."}</p>
                                    </div>
                                    {patient.teeth.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Treated Teeth</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {patient.teeth.map((t) => (
                                                    <div key={t.number} className="flex items-center gap-2 bg-emerald-50/70 border border-emerald-100/60 rounded-xl px-3 py-2">
                                                        <Stethoscope size={14} className="text-emerald-600 shrink-0" />
                                                        <div>
                                                            <p className="text-xs font-bold text-emerald-800">#{t.number}</p>
                                                            <p className="text-[10px] text-emerald-600">{t.treatmentType}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "beforeAfter" && (
                                <div className="space-y-4">
                                    <h3 className="text-base font-semibold text-gray-800">Before & After</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Before</span>
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                                                <img src={patient.beforeImageUrls?.[0] || patient.imageUrls[0]} alt="Before" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-2 left-2 bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-sm shadow-sm">Before</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">After</span>
                                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-emerald-200 shadow-sm">
                                                <img src={patient.afterImageUrls?.[0] || patient.imageUrls[0]} alt="After" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-2 left-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-sm shadow-sm">After</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "feedback" && (
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 mb-3">Feedback & Notes</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{patient.feedbackNotes || "No feedback."}</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

function DetailCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-gray-50/70 border border-gray-100/50 rounded-xl px-4 py-3 hover:bg-gray-50 hover:border-gray-200/60 transition-all duration-200">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
    );
}
