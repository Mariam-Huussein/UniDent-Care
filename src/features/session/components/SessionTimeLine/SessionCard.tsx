"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope } from "lucide-react";
import MediaSlider from "@/components/ui/MediaSlider";
import TimelineRail from "./sessionCardParts/TimelineRail";
import SessionCardHeader from "./sessionCardParts/SessionCardHeader";
import useSessionCard from "../../hooks/useSessionCard";
import SessionGradePanel from "./EvalComment/SessionGradePanel";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";
import DoctorEvalComment from "./EvalComment/DoctorEvalComment";

interface Props {
    session: TimelineSessionItem;
    index: number;
    isLast: boolean;
    role: string | null;
    onRefresh: () => void;
}

export default function SessionCard({ session, index, isLast, role, onRefresh }: Props) {
    const { states, computed } = useSessionCard(session, role);

    return (
        <div className="relative flex gap-4">
            <TimelineRail name={session.studentName} isLast={isLast} />

            <motion.article
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
                className="flex-1 min-w-0 mb-8"
            >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">

                    <SessionCardHeader
                        name={session.studentName}
                        date={session.createAt}
                        status={session.status}
                        isDone={computed.isDone}
                    />

                    {/* Treatment & Notes Section */}
                    <div className="px-5 pb-3 space-y-2">
                        {session.treatmentType && (
                            <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">{session.treatmentType}</p>
                        )}
                        {computed.hasNotesText && computed.visibleNotes.map((note) => (
                            <p key={note.id} className="text-[14px] text-slate-600 dark:text-slate-300 border-l-2 border-indigo-200 pl-3">
                                {note.note}
                            </p>
                        ))}
                    </div>

                    {computed.allMedias.length > 0 && <MediaSlider medias={computed.allMedias} />}

                    <div className="mx-5 border-t border-slate-100 dark:border-slate-800" />

                    {/* Evaluation Section */}
                    <div className="px-5 pt-4 pb-5 space-y-4">
                        <DoctorEvalComment
                            session={session}
                            isDoctor={computed.canEvaluate}
                            onEdit={() => states.setShowEvalForm(true)}
                        />

                        <AnimatePresence>
                            {states.showEvalForm && computed.canEvaluate && (
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white">
                                        <Stethoscope size={14} />
                                    </div>
                                    <SessionGradePanel
                                        session={session}
                                        existing={computed.hasEval}
                                        onSuccess={() => { states.setShowEvalForm(false); onRefresh(); }}
                                        onCancel={() => states.setShowEvalForm(false)}
                                    />
                                </div>
                            )}
                        </AnimatePresence>

                        {computed.canEvaluate && !computed.hasEval && !states.showEvalForm && (
                            <button
                                onClick={() => states.setShowEvalForm(true)}
                                className="w-full text-left px-4 py-2.5 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 hover:bg-teal-50 transition-all"
                            >
                                Add your evaluation for this session…
                            </button>
                        )}
                    </div>
                </div>
            </motion.article>
        </div>
    );
}
