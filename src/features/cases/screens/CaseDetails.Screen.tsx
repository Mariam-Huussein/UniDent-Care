"use client";

import { AnimatePresence, motion } from "framer-motion";
import DentalImageGallery from "../components/CaseDetails/Clinical/DentalImageGallery";
import PatientInfoPanel from "../components/CaseDetails/Layout/CaseInfoPanel";
import PatientDetailTabs from "../components/CaseDetails/Tabs/CaseDetailTabs";
import PatientDetailsSkeleton from "../components/CaseDetails/Layout/CaseDetailsSkeleton";
import Odontogram from "../components/CaseDetails/Clinical/Odontogram";
import ActivityTimeline from "../components/CaseDetails/Tracking/ActivityTimeline";
import CaseDetailsTopBar from "../components/CaseDetails/Layout/CaseDetailsTopBar";
import { useCaseDetails } from "../hooks/useCaseDetails";

export default function CaseDetailsScreen({ caseId }: { caseId: string }) {
    const { patient, isLoading, status, role } = useCaseDetails(caseId);

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
            <div className="max-w-[1200px] mx-auto space-y-6">

                {/* ═══ Top Bar ═══ */}
                <CaseDetailsTopBar currentStatus={status} patientName={patient?.patientName || ""} />

                {/* ═══ Content ═══ */}
                {isLoading ? (
                    <PatientDetailsSkeleton />
                ) : !patient ? (
                    <div className="flex items-center justify-center p-20 text-gray-500">Case not found.</div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={status}
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
                                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-5 sm:p-6 lg:p-8 transition-colors duration-300">
                                    <PatientInfoPanel patient={patient} role={role} />
                                </div>
                            </div>

                            {/* ── In Progress: Split View (Odontogram L + Timeline/Progress R) ── */}
                            {status === "in-progress" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                    className="grid grid-cols-1 lg:grid-cols-5 gap-6"
                                >
                                    {/* LEFT — Odontogram (larger) */}
                                    <div className="relative lg:col-span-3 p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-colors duration-300">
                                        <div className="relative z-10 w-full">
                                            <Odontogram teeth={patient.teeth} readonly={true} status={status} />
                                        </div>
                                    </div>

                                    {/* RIGHT — Timeline */}
                                    <div className="lg:col-span-2 space-y-5">
                                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-5 sm:p-6 transition-colors duration-300">
                                            <ActivityTimeline events={patient.timeline} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Other states: Bottom Tabs ── */}
                            {status !== "in-progress" && (
                                <PatientDetailTabs patient={patient} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
