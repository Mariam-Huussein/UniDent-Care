"use client";

import { motion } from "framer-motion";
import { GraduationCap, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { PatientCase } from "../../../types/CaseDetails.types";
import DentalImageGallery from "../Clinical/DentalImageGallery";

interface AssignedContentProps {
    patient: PatientCase;
}

export default function AssignedContent({ patient }: AssignedContentProps) {
    const student = patient.student;

    return (
        <div className="space-y-5">
            {/* Waiting Status */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-blue-50/80 border border-blue-100 rounded-2xl px-5 py-4"
            >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Clock size={18} className="text-blue-600" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-700">Waiting for Diagnosis</p>
                    <p className="text-xs text-blue-500 mt-0.5">The assigned student will begin the examination soon</p>
                </div>
            </motion.div>

            {/* Student Card */}
            {student && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    <div className="px-5 pt-5 pb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Assigned Student</h3>
                    </div>

                    <div className="px-5 pb-5">
                        <div className="flex items-start gap-4">
                            {/* Student Avatar */}
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <GraduationCap size={22} className="text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-semibold text-gray-800 truncate">
                                    {student.name}
                                </h4>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {student.university} · Level {student.level}
                                </p>

                                {/* Contact info */}
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} className="text-gray-400" />
                                        <span>{student.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} className="text-gray-400" />
                                        <span className="truncate">{student.email}</span>
                                    </div>
                                </div>

                                {/* Contact buttons */}
                                <div className="flex gap-2 mt-4">
                                    <button className="my-btn px-4 !text-xs group">
                                        <Phone size={14} className="group-hover:animate-bounce" />
                                        Call
                                    </button>
                                    <button className="my-btn-outline px-4 !text-xs group">
                                        <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
                                        Message
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Dental Images */}
            <DentalImageGallery images={patient.imageUrls} />
        </div>
    );
}
