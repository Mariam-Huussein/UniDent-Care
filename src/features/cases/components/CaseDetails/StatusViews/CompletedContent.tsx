"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileText, MessageSquare, ArrowRight } from "lucide-react";
import { PatientCase } from "../../../types/CaseDetails.types";
import DentalImageGallery from "../Clinical/DentalImageGallery";
import ActivityTimeline from "../Tracking/ActivityTimeline";

interface CompletedContentProps {
    patient: PatientCase;
}

export default function CompletedContent({ patient }: CompletedContentProps) {
    return (
        <div className="space-y-5">
            {/* Completion Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5"
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-emerald-800">Treatment Completed</h3>
                        {patient.completedAt && (
                            <p className="text-xs text-emerald-600 mt-0.5">
                                Completed on {new Date(patient.completedAt).toLocaleDateString('en-US', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Treatment Summary */}
            {patient.treatmentSummary && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText size={16} className="text-blue-500" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800">Treatment Summary</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {patient.treatmentSummary}
                    </p>
                </motion.div>
            )}

            {/* Before & After Comparison */}
            {patient.beforeImageUrls && patient.afterImageUrls && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    <div className="px-5 pt-5 pb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Before & After</h3>
                    </div>
                    <div className="px-5 pb-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Before */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Before</span>
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200">
                                    <img
                                        src={patient.beforeImageUrls[0]}
                                        alt="Before treatment"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-red-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                                        Before
                                    </div>
                                </div>
                            </div>

                            {/* Arrow (desktop) */}
                            <div className="hidden sm:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            </div>

                            {/* After */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">After</span>
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-emerald-200">
                                    <img
                                        src={patient.afterImageUrls[0]}
                                        alt="After treatment"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-emerald-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                                        After
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Feedback Notes */}
            {patient.feedbackNotes && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <MessageSquare size={16} className="text-amber-500" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-800">Feedback & Notes</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {patient.feedbackNotes}
                    </p>
                </motion.div>
            )}

            {/* Activity Timeline */}
            <ActivityTimeline events={patient.timeline} />

            {/* All Dental Images */}
            <DentalImageGallery images={patient.imageUrls} />
        </div>
    );
}
