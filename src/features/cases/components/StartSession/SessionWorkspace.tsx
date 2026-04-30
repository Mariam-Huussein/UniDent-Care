"use client";

import { motion } from "framer-motion";
import { ClipboardList, FileText } from "lucide-react";
import { SessionItem, SessionNoteItem } from "../../types/Sessions.types";
import NoteCard from "./NoteCard";
import AddNoteForm from "./AddNoteForm";

interface SessionWorkspaceProps {
    session: SessionItem | null;
    notes: SessionNoteItem[];
    onAddNote: (note: string, isPrivate: boolean, imageUrl?: string) => Promise<void>;
    noteLoading: boolean;
}

export default function SessionWorkspace({
    session,
    notes,
    onAddNote,
    noteLoading,
}: SessionWorkspaceProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="space-y-5"
        >
            {/* ═══ Session Info Header ═══ */}
            {session && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-5 sm:p-6 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-md">
                            <ClipboardList size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">Session Details</h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Treatment workspace</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-100/50 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Patient</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{session.patientName}</p>
                        </div>
                        <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-100/50 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Treatment Type</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{session.treatmentType || "General"}</p>
                        </div>
                        <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-100/50 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Scheduled</p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {new Date(session.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                        </div>
                        <div className="bg-slate-50/70 dark:bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-100/50 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Status</p>
                            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">{session.status}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ Notes Section ═══ */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-5 sm:p-6 transition-colors duration-300">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-md">
                            <FileText size={15} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Clinical Notes</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {notes.length === 0
                                    ? "No notes yet — add your first note below"
                                    : `${notes.length} note${notes.length === 1 ? "" : "s"} recorded`
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes Timeline */}
                {notes.length > 0 && (
                    <div className="mb-6 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {notes.map((n, i) => (
                            <NoteCard key={n.id} note={n} index={i} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {notes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-10 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <FileText size={28} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                            Start documenting your session
                        </p>
                        <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                            Clinical notes will appear here as you add them
                        </p>
                    </motion.div>
                )}

                {/* Divider */}
                <div className="h-px bg-slate-100 dark:bg-slate-800/80 mb-5" />

                {/* Add Note Form */}
                <AddNoteForm onSubmit={onAddNote} isLoading={noteLoading} />
            </div>
        </motion.div>
    );
}
