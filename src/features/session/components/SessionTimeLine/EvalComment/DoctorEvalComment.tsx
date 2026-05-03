"use client";

import { motion } from "framer-motion";
import { Award, MoreHorizontal } from "lucide-react";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";
import StarRow from "../sessionCardParts/StarRow";
import CustomAvatar from "../sessionCardParts/Avatar";
import { gradeStyle } from "@/features/session/services/gradeStyle";

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
            <CustomAvatar name={session.evaluteDoctorName} gradient="from-teal-500 to-emerald-600" />

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
