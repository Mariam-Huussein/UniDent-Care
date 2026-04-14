"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CaseStatus, PatientCase } from "../../../types/CaseDetails.types";
import Odontogram from "../Clinical/Odontogram";
import ActivityTimeline from "../Tracking/ActivityTimeline";
import ProgressTracker from "../Tracking/ProgressTracker";
import MedicalInfoTab from "./MedicalInfoTab";
import AssignedStudentTab from "./AssignedStudentTab";
import BeforeAfterTab from "./BeforeAfterTab";

interface PatientDetailTabsProps {
    patient: PatientCase;
}

type TabDef = { key: string; label: string };

function getTabsForStatus(status: CaseStatus): TabDef[] {
    switch (status) {
        case "unassigned":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
            ];
        case "diagnosis":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
            ];
        case "in-progress":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "progress", label: "Progress" },
                { key: "medical", label: "Medical Info" },
                { key: "timeline", label: "Timeline" },
            ];
        case "completed":
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "beforeAfter", label: "Before & After" },
                { key: "medical", label: "Medical Info" },
                { key: "timeline", label: "Timeline" },
                { key: "feedback", label: "Feedback" },
            ];
        default:
            return [
                { key: "odontogram", label: "Odontogram" },
                { key: "medical", label: "Medical Info" },
            ];
    }
}

export default function PatientDetailTabs({ patient }: PatientDetailTabsProps) {
    const role = useSelector((state: RootState) => state.auth.role);
    const userId = useSelector((state: RootState) => state.auth.user?.publicId || "");
    const isCurrentStudent = role === "Student" && patient.student?.id === userId;
    const isDoctor = role === "Doctor";

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
            className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-colors duration-300"
        >
            {/* Background with blur separated to prevent tooltip stacking context issues */}
            <div className="absolute inset-0 backdrop-blur-md rounded-2xl -z-10" />

            <div className="relative z-10 overflow-hidden rounded-2xl">
                {/* Tab Headers */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto patient-details-scrollbar px-1 transition-colors duration-300">
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`relative px-5 py-4 text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === key
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            {label}
                            {activeTab === key && (
                                <motion.div
                                    layoutId="pd-tab-indicator"
                                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-indigo-600 dark:bg-indigo-500 rounded-full"
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
                            {activeTab === "student" && patient.student && <AssignedStudentTab student={patient.student} />}
                            {activeTab === "odontogram" && <Odontogram teeth={patient.teeth} readonly={patient.status !== "diagnosis" || !(isDoctor || isCurrentStudent)} status={patient.status} />}
                            {activeTab === "progress" && <ProgressTracker currentStep={patient.progressStep} />}
                            {activeTab === "medical" && <MedicalInfoTab medicalHistory={patient.medicalHistory} medications={patient.medications} />}
                            {activeTab === "timeline" && <ActivityTimeline events={patient.timeline} />}

                            {activeTab === "beforeAfter" && (
                                <BeforeAfterTab
                                    beforeImageUrls={patient.beforeImageUrls}
                                    afterImageUrls={patient.afterImageUrls}
                                    defaultImageUrls={patient.imageUrls}
                                />
                            )}

                            {activeTab === "feedback" && (
                                <div>
                                    <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-3">Feedback & Notes</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{patient.feedbackNotes || "No feedback."}</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
