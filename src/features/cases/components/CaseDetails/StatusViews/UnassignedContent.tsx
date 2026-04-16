"use client";

import { motion } from "framer-motion";
import { HandHelping, Sparkles } from "lucide-react";
import { PatientCase } from "../../../types/CaseDetails.types";
import DentalImageGallery from "../Clinical/DentalImageGallery";

interface UnassignedContentProps {
    patient: PatientCase;
}

export default function UnassignedContent({ patient }: UnassignedContentProps) {
    const notes = patient.diagnosisdto?.notes || patient.description;

    return (
        <div className="space-y-5">
            {/* Dental Images */}
            <DentalImageGallery images={patient.imageUrls} />

            {/* Diagnosis Notes */}
            {notes && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-5"
                >
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Notes</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                        {notes}
                    </p>
                </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-3"
            >
                <button className="my-btn px-6 group">
                    <HandHelping size={16} className="group-hover:scale-110 transition-transform" />
                    Take Case
                </button>
                <button className="my-btn-outline px-6 group">
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                    Request Diagnosis
                </button>
            </motion.div>
        </div>
    );
}
