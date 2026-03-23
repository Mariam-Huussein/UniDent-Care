"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";

interface ProgressTrackerProps {
    currentStep: number;
}

const STEPS = [
    { label: "Case Added", desc: "AI exam" },
    { label: "Diagnosis", desc: "Initial exam" },
    { label: "Treatment", desc: "Active care" },
    { label: "Follow-up", desc: "Post-review" },
];

export default function ProgressTracker({ currentStep }: ProgressTrackerProps) {
    return (
        <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-800">Treatment Progress</h3>

            <div className="flex items-start">
                {STEPS.map((step, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep;
                    const last = i === STEPS.length - 1;

                    return (
                        <div key={step.label} className="flex-1 flex flex-col items-center text-center relative">
                            {/* Connector */}
                            {!last && (
                                <div className="absolute top-4 left-[50%] w-full h-[3px] z-0 rounded-full overflow-hidden bg-gray-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: done ? "100%" : "0%" }}
                                        transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                    />
                                </div>
                            )}

                            {/* Circle */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done
                                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-500 text-white shadow-lg shadow-blue-200"
                                        : active
                                            ? "bg-white border-blue-500 text-blue-600 shadow-lg shadow-blue-100 ring-4 ring-blue-50"
                                            : "bg-gray-50 border-gray-200 text-gray-300"
                                    }`}
                            >
                                {done ? (
                                    <Check size={15} strokeWidth={3} />
                                ) : active ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                                ) : (
                                    <Circle size={10} />
                                )}
                            </motion.div>

                            <p className={`text-xs font-semibold mt-2.5 transition-colors ${done || active ? "text-gray-800" : "text-gray-400"}`}>
                                {step.label}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{step.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
