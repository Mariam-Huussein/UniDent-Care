"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { CaseStatus } from "@/features/cases/types/CaseDetails.types";
import { DiagnosisDto } from "@/services/PatientDashboardAnalytics";
import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { progressTrackerTranslations } from "../../constants/progressTracker.translate";

interface ProgressTrackerProps {
    status: CaseStatus;
    createdByRole: string;
    diagnosisdto: DiagnosisDto[] | null;
    supervisingDoctorName?: string;
    StudentName?: string;
}

export default function ProgressTracker({ status, createdByRole, diagnosisdto, supervisingDoctorName }: ProgressTrackerProps) {
    const { language } = useLanguage();
    const dict = progressTrackerTranslations[language as "ar" | "en"] || progressTrackerTranslations.en;
    const isAr = language === "ar";
    let currentStep = 0;

    if (status.toLowerCase() === "completed") {
        currentStep = 4;
    } else if (status.toLowerCase() === "inprogress") {
        currentStep = 2;
    } else if ((diagnosisdto || diagnosisdto !== null)) {
        currentStep = 1;
    } else {
        currentStep = 0;
    }

    const getInitialStageDesc = () => {
        if (!diagnosisdto || diagnosisdto.length === 0) {
            const roleKey = (createdByRole || "").toLowerCase() as keyof typeof dict;
            return createdByRole === "Patient" ? dict.aiExam : `${dict.by} ${dict[roleKey] || createdByRole}`;
        }

        const firstStage = diagnosisdto[0].stage;
        if (firstStage === 0 || firstStage === "AI") {
            return dict.aiExam;
        }
        return dict.byDoctor;
    };

    const isReviewed = (diagnosisdto && diagnosisdto !== null) && status === 'InProgress';

    const diagnosisLabel = isReviewed
        ? dict.reviewedBySupervisor
        : dict.clinicalDiagnosis;

    const diagnosisDesc = isReviewed
        ? dict.verifiedReview
        : dict.clinicalExam;

    const STEPS = [
        { label: dict.caseAdded, desc: getInitialStageDesc() },
        { label: diagnosisLabel, desc: diagnosisDesc },
        { label: dict.treatment, desc: dict.activeCare },
        { label: dict.caseClosed, desc: dict.completed },
    ];

    return (
        <div className="space-y-5" dir={isAr ? "rtl" : "ltr"}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{dict.treatmentProgress}</h3>
            </div>

            <div className="flex items-start">
                {STEPS.map((step, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep;
                    const last = i === STEPS.length - 1;

                    return (
                        <div key={step.label} className="flex-1 flex flex-col items-center text-center relative">
                            {/* Connector */}
                            {!last && (
                                <div className={`absolute top-4 left-[50%] w-full h-[3px] z-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ${isAr ? "right-[50%]" : "left-[50%]"}`}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: done ? "100%" : "0%" }}
                                        transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
                                        className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full"
                                    />
                                </div>
                            )}

                            {/* Circle */}
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                                className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done
                                    ? "bg-indigo-600 border-indigo-600 dark:border-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50"
                                    : active
                                        ? "bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 ring-4 ring-indigo-50 dark:ring-indigo-900/10"
                                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600"
                                    }`}
                            >
                                {done ? (
                                    <Check size={15} strokeWidth={3} />
                                ) : active ? (
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
                                ) : (
                                    <Circle size={10} />
                                )}
                            </motion.div>

                            <p className={`text-xs font-semibold mt-2.5 transition-colors ${done || active ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}>
                                {step.label}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 hidden sm:block">{step.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}