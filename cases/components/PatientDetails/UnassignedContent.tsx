"use client";

import { motion } from "framer-motion";
import { HandHelping, Sparkles } from "lucide-react";
import { PatientCase } from "../../types/patientDetails.types";
import { getUrgencyConfig } from "../../utils/patientDetails.utils";
import DentalImageGallery from "./DentalImageGallery";

interface UnassignedContentProps {
    patient: PatientCase;
}

export default function UnassignedContent({ patient }: UnassignedContentProps) {
    const urgency = patient.urgencyTag ? getUrgencyConfig(patient.urgencyTag) : null;

    return (
        <div className="space-y-5">
            {/* Urgency Tag */}
            {urgency && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium ${urgency.bg} ${urgency.text} ${urgency.border}`}
                >
                    {urgency.label}
                </motion.div>
            )}

            {/* Dental Images */}
            <DentalImageGallery images={patient.imageUrls} />

            {/* Patient Notes */}
            {patient.patientNotes && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Patient Notes</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {patient.patientNotes}
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
