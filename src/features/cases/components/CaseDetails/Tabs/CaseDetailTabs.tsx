"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { PatientCase, ToothStatus } from "../../../types/CaseDetails.types";
import Odontogram from "../Clinical/Odontogram";
import ActivityTimeline from "../Tracking/ActivityTimeline";
import MedicalInfoTab from "./parts/MedicalInfoTab";
import AssignedStudentTab from "./parts/AssignedStudentTab";
import BeforeAfterTab from "./parts/BeforeAfterTab";
import { useCase } from "@/features/cases/context/CaseContext";
import { getTabsForStatus } from "@/features/cases/utils/CaseDetails.utils";


export default function PatientDetailTabs() {
    const role = useSelector((state: RootState) => state.auth.role);
    const { caseData, doctorOwnerData, studentOwnerData } = useCase();
    const patient = caseData as PatientCase;

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
                            {activeTab === "odontogram" &&
                                <Odontogram 
                                    teeth={patient?.diagnosisdto?.teethNumbers?.map(num => ({
                                        number: num,
                                        status: patient?.diagnosisdto?.diagnosisStage as ToothStatus,
                                        notes: patient.diagnosisdto?.notes || "",
                                    })) || []} 
                                    readonly={true} 
                                    status={patient?.diagnosisdto?.diagnosisStage}
                                    diagnosisdto={patient.diagnosisdto}
                                    assignedStudentName={studentOwnerData?.data?.fullName}
                                    assignedDoctorName={doctorOwnerData?.data?.fullName}
                                />
                            }
                            {activeTab === "medical" && <MedicalInfoTab medicalHistory={patient.medicalHistory} medications={patient.medications} />}
                            {activeTab === "timeline" && <ActivityTimeline events={patient.timeline} />}

                            {activeTab === "beforeAfter" && (
                                <BeforeAfterTab
                                    beforeImageUrls={patient.beforeImageUrls}
                                    afterImageUrls={patient.afterImageUrls}
                                    defaultImageUrls={patient.imageUrls}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
