"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { PatientCase } from "../../../types/CaseDetails.types";
import DentalImageGallery from "../Clinical/DentalImageGallery";
import Odontogram from "../Clinical/Odontogram";
import ProgressTracker from "../Tracking/ProgressTracker";
import ActivityTimeline from "../Tracking/ActivityTimeline";

interface InProgressContentProps {
    patient: PatientCase;
}

export default function InProgressContent({ patient }: InProgressContentProps) {
    const nextSession = patient.sessions.find(s => s.isNext);

    return (
        <div className="space-y-5">
            {/* Progress Tracker */}
            <ProgressTracker currentStep={patient.progressStep} />

            {/* Next Session Card */}
            {nextSession && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-linear-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-5 group cursor-pointer hover:shadow-md hover:shadow-amber-100/50 transition-all duration-300"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                                <CalendarDays size={18} className="text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">Next Session</h3>
                                <p className="text-xs text-gray-500 mt-1">{nextSession.description}</p>
                                <div className="flex items-center gap-3 mt-2.5">
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                                        <CalendarDays size={12} />
                                        {new Date(nextSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-lg">
                                        <Clock size={12} />
                                        {nextSession.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                </motion.div>
            )}

            {/* Odontogram */}
            <Odontogram teeth={patient.teeth} />

            {/* Two-column: Timeline + Images */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ActivityTimeline events={patient.timeline} />
                <DentalImageGallery images={patient.imageUrls} />
            </div>
        </div>
    );
}
