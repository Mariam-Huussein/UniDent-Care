"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CaseStatus } from "../types/patientDetails.types";
import { getMockPatientCase, getPatientStatusConfig } from "../utils/patientDetails.utils";
import DentalImageGallery from "../components/PatientDetails/DentalImageGallery";
import PatientInfoPanel from "../components/PatientDetails/PatientInfoPanel";
import PatientDetailTabs from "../components/PatientDetails/PatientDetailTabs";
import PatientDetailsSkeleton from "../components/PatientDetails/PatientDetailsSkeleton";
import Odontogram from "../components/PatientDetails/Odontogram";
import ActivityTimeline from "../components/PatientDetails/ActivityTimeline";

const STATUS_OPTIONS: CaseStatus[] = ["unassigned", "diagnosis", "in-progress", "completed"];

export default function PatientDetailsScreen() {
    const router = useRouter();
    const [currentStatus, setCurrentStatus] = useState<CaseStatus>("in-progress");
    const [isLoading, setIsLoading] = useState(false);

    const patient = getMockPatientCase(currentStatus);

    const handleStatusChange = (status: CaseStatus) => {
        setIsLoading(true);
        setCurrentStatus(status);
        setTimeout(() => setIsLoading(false), 300);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50/80 via-slate-50 to-blue-50/30 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            <div className="max-w-[1200px] mx-auto space-y-6">

                {/* ═══ Top Bar ═══ */}
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
                            className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-md transition-all cursor-pointer"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={17} />
                        </motion.button>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">Patient Details</h1>
                            <p className="text-[11px] text-gray-400 font-medium">Case lifecycle view</p>
                        </div>
                    </div>

                    {/* Status Toggle — glassy pill */}
                    <div className="flex flex-wrap gap-1 bg-white/70 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-sm p-1">
                        {STATUS_OPTIONS.map((status) => {
                            const cfg = getPatientStatusConfig(status);
                            const active = currentStatus === status;
                            return (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-250 cursor-pointer ${active
                                        ? `${cfg.bg} ${cfg.text} shadow-sm`
                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/60"
                                        }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? cfg.dot : "bg-gray-300"}`} />
                                    {cfg.label}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ═══ Content ═══ */}
                {isLoading ? (
                    <PatientDetailsSkeleton />
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStatus}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-6"
                        >
                            {/* ── Split Layout: Images (L) + Info Panel (R) ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
                                {/* LEFT — Image Gallery */}
                                <div className="lg:col-span-5">
                                    <DentalImageGallery images={patient.imageUrls} />
                                </div>
                                
                                {/* RIGHT — Info Panel */}
                                <div className="lg:col-span-7 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm shadow-gray-100/50 p-5 sm:p-6 lg:p-8">
                                    <PatientInfoPanel patient={patient} />
                                </div>
                            </div>

                            {/* ── In Progress: Split View (Odontogram L + Timeline/Progress R) ── */}
                            {currentStatus === "in-progress" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="grid grid-cols-1 lg:grid-cols-5 gap-6"
                                >
                                    {/* LEFT — Odontogram (larger) */}
                                    <div className="relative lg:col-span-3 p-5 sm:p-6">
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm pointer-events-none" />
                                        <div className="relative z-10 w-full">
                                            <Odontogram teeth={patient.teeth} />
                                        </div>
                                    </div>

                                    {/* RIGHT — Timeline */}
                                    <div className="lg:col-span-2 space-y-5">
                                        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100/80 shadow-sm p-5 sm:p-6">
                                            <ActivityTimeline events={patient.timeline} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Other states: Bottom Tabs ── */}
                            {currentStatus !== "in-progress" && (
                                <PatientDetailTabs patient={patient} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}