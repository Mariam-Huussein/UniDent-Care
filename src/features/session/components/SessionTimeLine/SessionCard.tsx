"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, ChevronDown, Clock, Stethoscope } from "lucide-react";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";
import DoctorEvalComment from "./DoctorEvalComment";
import SessionGradePanel, { gradeStyle } from "./SessionGradePanel";
import MediaSlider from "@/components/ui/MediaSlider";

/* ─────────────────── helpers ─────────────────── */
function initials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
}
function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", hour12: true,
    });
}

/* ─────────────────── Props ─────────────────── */
interface Props {
    session: TimelineSessionItem;
    index: number;
    isLast: boolean;
    role: string | null;
    onRefresh: () => void;
}

/* ─────────────────── Component ─────────────────── */
export default function SessionCard({ session, index, isLast, role, onRefresh }: Props) {
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [showEvalForm, setShowEvalForm] = useState(false);

    const userId = Cookies.get("user_id");
    const isDoctor = role === "Doctor";
    const isDone = ["done", "completed"].includes(session.status?.toLowerCase());

    // grade=0 with empty doctorNote = backend default, treat as "not yet evaluated"
    const hasEval = !(session.grade === 0 && !session.doctorNote?.trim());

    // Only the assigned doctor (or any doctor if none assigned yet) can evaluate
    const isAssignedEvaluator = !session.evaluteDoctorId || session.evaluteDoctorId === userId;
    const canEvaluate = isDoctor && isDone && isAssignedEvaluator;

    const allMedias = session.notes.flatMap((n) => n.medias);
    const visibleNotes = showAllNotes ? session.notes : session.notes.slice(0, 2);
    const gs = hasEval ? gradeStyle(session.grade) : null;

    // Determine if we have any actual note text
    const hasNotesText = session.notes.some((n) => n.note && n.note.trim() !== "");

    return (
        <div className="relative flex gap-4">
            {/* ── Timeline rail ── */}
            <div className="flex flex-col items-center">
                <div className="relative z-10 w-11 h-11 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md ring-[3px] ring-white dark:ring-slate-950 text-white font-bold text-xs shrink-0">
                    {initials(session.studentName)}
                </div>
                {!isLast && (
                    <div className="w-px flex-1 min-h-[32px] mt-2 bg-linear-to-b from-indigo-200 dark:from-indigo-800/50 to-transparent" />
                )}
            </div>

            {/* ── Card ── */}
            <motion.article
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.07, duration: 0.4, type: "spring", bounce: 0.18 }}
                className="flex-1 min-w-0 mb-8"
            >
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-none transition-shadow duration-300 overflow-hidden">

                    {/* ── Header ── */}
                    <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            {/* Name only — no "Student" badge, no grade chip (shown in eval comment) */}
                            <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100">
                                {session.studentName}
                            </span>

                            {/* Date · Time */}
                            <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-400 dark:text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Calendar size={10} />
                                    {formatDate(session.createAt)}
                                </span>
                                <span className="text-slate-200 dark:text-slate-700">·</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatTime(session.createAt)}
                                </span>
                            </div>
                        </div>

                        {/* Status badge */}
                        <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isDone
                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                            }`}>
                            <CheckCircle2 size={9} />
                            {session.status}
                        </span>
                    </div>

                    {/* ── Treatment type ── */}
                    {session.treatmentType && (
                        <div className="px-5 pb-3">
                            <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                                {session.treatmentType}
                            </p>
                        </div>
                    )}

                    {/* ── Notes text only ── */}
                    {hasNotesText && (
                        <div className="px-5 pb-3 space-y-2">
                            {visibleNotes.map((note, ni) => (
                                note.note && note.note.trim() !== "" && (
                                    <div
                                        key={note.id}
                                        className={`transition-opacity ${ni === 1 && !showAllNotes && session.notes.length > 2
                                                ? "opacity-40" : "opacity-100"
                                            }`}
                                    >
                                        <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-indigo-200 dark:border-indigo-800/50">
                                            {note.note}
                                        </p>
                                    </div>
                                )
                            ))}

                            {session.notes.length > 2 && (
                                <button
                                    onClick={() => setShowAllNotes(!showAllNotes)}
                                    className="flex items-center gap-1 text-[12px] font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mt-2"
                                >
                                    <ChevronDown
                                        size={13}
                                        className={`transition-transform duration-200 ${showAllNotes ? "rotate-180" : ""}`}
                                    />
                                    {showAllNotes
                                        ? "Show less"
                                        : `${session.notes.length - 2} more note${session.notes.length - 2 > 1 ? "s" : ""}`}
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── All Images Slider ── */}
                    {allMedias.length > 0 && (
                        <div className="pb-4">
                            <MediaSlider medias={allMedias} />
                        </div>
                    )}

                    {/* ── Divider ── */}
                    <div className="mx-5 border-t border-slate-100 dark:border-slate-800" />

                    {/* ── Evaluation section ── */}
                    <div className="px-5 pt-4 pb-5 space-y-4">
                        {/* Existing doctor evaluation as comment bubble */}
                        <DoctorEvalComment
                            session={session}
                            isDoctor={canEvaluate}
                            onEdit={() => setShowEvalForm(true)}
                        />

                        {/* Grade form — slides in when doctor clicks evaluate */}
                        <AnimatePresence>
                            {showEvalForm && canEvaluate && (
                                <div className="flex items-start gap-3">
                                    <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900">
                                        <Stethoscope size={14} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <SessionGradePanel
                                            session={session}
                                            existing={hasEval}
                                            onSuccess={() => { setShowEvalForm(false); onRefresh(); }}
                                            onCancel={() => setShowEvalForm(false)}
                                        />
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                        {canEvaluate && !hasEval && !showEvalForm && (
                            <div className="flex items-center gap-3">
                                <div className="shrink-0 w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-slate-900">
                                    <Stethoscope size={14} className="text-white" />
                                </div>
                                <button
                                    onClick={() => setShowEvalForm(true)}
                                    className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-200 dark:border-slate-700 text-[13px] text-slate-400 dark:text-slate-500 hover:bg-teal-50 dark:hover:bg-teal-900/10 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                                >
                                    Add your evaluation for this session…
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.article>
        </div>
    );
}
