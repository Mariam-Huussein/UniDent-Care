"use client";

import { motion } from "framer-motion";
import { Clock, Paperclip } from "lucide-react";
import { SessionNoteItem } from "../../types/Sessions.types";
import MediaSlider from "@/components/ui/MediaSlider";

interface NoteCardProps {
    note: SessionNoteItem;
    index: number;
}

export default function NoteCard({ note, index }: NoteCardProps) {
    const time = new Date(note.createAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative"
        >
            {/* Timeline connector */}
            <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-200 dark:bg-slate-700/60 group-last:hidden" />

            <div className="flex gap-3">
                {/* Timeline dot */}
                <div className="relative z-10 mt-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md bg-linear-to-br from-indigo-400 to-indigo-600">
                        {index + 1}
                    </div>
                </div>

                {/* Note content */}
                <div className="flex-1 pb-5">
                    <div className="bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-700/60 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                                    <Clock size={9} />
                                    Session Note
                                </span>
                                {note.medias.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                                        <Paperclip size={9} />
                                        {note.medias.length} media
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                {time}
                            </span>
                        </div>

                        {/* Body */}
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {note.note}
                        </p>

                        {/* Media attachments */}
                        {note.medias.length > 0 && (
                            <div className="pt-4">
                                <MediaSlider medias={note.medias} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
