"use client";

import { motion } from "framer-motion";
import { Award, MoreHorizontal, Star } from "lucide-react";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";
import { gradeStyle } from "./SessionGradePanel";

/* ── Star row ── */
function StarRow({ grade, max = 20 }: { grade: number; max?: number }) {
    const filled = Math.round((grade / max) * 5);
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={11}
                    className={
                        i < filled
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700"
                    }
                />
            ))}
        </div>
    );
}

/* ── Avatar ── */
function Avatar({ name, gradient }: { name: string; gradient: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return (
        <div
            className={`shrink-0 w-9 h-9 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900`}
        >
            <span className="text-white font-bold text-[11px]">{initials}</span>
        </div>
    );
}

interface Props {
    session: TimelineSessionItem;
    isDoctor: boolean;
    onEdit: () => void;
}

export default function DoctorEvalComment({ session, isDoctor, onEdit }: Props) {
    // grade=0 with empty doctorNote = backend default, not a real evaluation
    const isRealEval = !(session.grade === 0 && !session.doctorNote?.trim());

    if (!isRealEval || !session.evaluteDoctorName) return null;
    const gs = gradeStyle(session.grade);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3"
        >
            <Avatar name={session.evaluteDoctorName} gradient="from-teal-500 to-emerald-600" />

            <div className="flex-1 min-w-0">
                {/* Bubble */}
                <div
                    className={`relative bg-slate-50 dark:bg-slate-800/60 rounded-2xl rounded-tl-none px-4 py-3 border ${gs.border} dark:border-slate-700/50`}
                >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-100">
                                Dr. {session.evaluteDoctorName}
                            </span>
                            <span className="text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-1.5 py-0.5 rounded border border-teal-100 dark:border-teal-800/40 uppercase tracking-wider">
                                Supervisor
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Grade pill */}
                            <div
                                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[12px] font-black ${gs.color} ${gs.bg} ${gs.border}`}
                            >
                                <Award size={10} />
                                {session.grade}/20
                            </div>
                            <StarRow grade={session.grade} />
                            {isDoctor && (
                                <button
                                    onClick={onEdit}
                                    className="text-slate-300 dark:text-slate-600 hover:text-indigo-500 dark:hover:text-indigo-400 p-0.5 rounded transition-colors"
                                    title="Edit evaluation"
                                >
                                    <MoreHorizontal size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Feedback text */}
                    {session.doctorNote && (
                        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            {session.doctorNote}
                        </p>
                    )}

                    {/* Label chip */}
                    <span
                        className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${gs.bg} ${gs.color} ${gs.border} border`}
                    >
                        {gs.label}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
