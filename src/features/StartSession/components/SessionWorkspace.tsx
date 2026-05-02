"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import NoteCard from "@/features/session/components/StartSession/NoteCard";
import AddNoteForm from "@/features/session/components/StartSession/AddNoteForm";
import { SessionItem, SessionNoteItem } from "@/features/session/types/Sessions.types";

interface SessionWorkspaceProps {
    session: SessionItem | null;
    notes: SessionNoteItem[];
    onAddNote: (note: string, files?: File[]) => Promise<void>;
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
            {/* SESSION DETAILS CARD*/}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800
                            shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]
                            overflow-hidden transition-colors duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4
                                border-b border-slate-100 dark:border-slate-800
                                bg-linear-to-r from-violet-50/60 to-white dark:from-violet-950/20 dark:to-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-violet-700
                                        flex items-center justify-center shadow-lg shadow-violet-300/30 dark:shadow-violet-900/40 shrink-0">
                            <FileText size={15} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Clinical Notes</h3>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                {notes.length === 0
                                    ? "No notes yet — start below"
                                    : `${notes.length} note${notes.length === 1 ? "" : "s"} recorded`}
                            </p>
                        </div>
                    </div>

                    {notes.length > 0 && (
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold
                                         bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shrink-0">
                            {notes.length}
                        </span>
                    )}
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                    {/* Timeline */}
                    <AnimatePresence>
                        {notes.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
                            >
                                {notes.map((n, i) => (
                                    <NoteCard key={n.id} note={n} index={i} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty state */}
                    {notes.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center gap-3 py-8 text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                <FileText size={26} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">Start documenting your session</p>
                                <p className="text-xs text-slate-300 dark:text-slate-600 mt-0.5">Clinical notes will appear here</p>
                            </div>
                        </motion.div>
                    )}

                    {/* ── Divider with label ── */}
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap px-1">
                            New Note
                        </span>
                        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    </div>

                    {/* Form */}
                    <AddNoteForm onSubmit={onAddNote} isLoading={noteLoading} />
                </div>
            </div>
        </motion.div>
    );
}
