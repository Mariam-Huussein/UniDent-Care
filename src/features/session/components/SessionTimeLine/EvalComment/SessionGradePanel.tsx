"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { evaluateSession } from "@/features/cases/server/sessions.action";
import { TimelineSessionItem } from "@/features/session/types/Sessions.types";
import { gradeStyle } from "@/features/session/services/gradeStyle";

interface Props {
    session: TimelineSessionItem;
    existing: boolean;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function SessionGradePanel({ session, existing, onSuccess, onCancel }: Props) {
    const [grade, setGrade] = useState<number>(session.grade ?? 15);
    const [note, setNote] = useState(session.doctorNote ?? "");
    const [isFinal, setIsFinal] = useState(false);
    const [loading, setLoading] = useState(false);
    const gs = gradeStyle(grade);

    const handleSubmit = async () => {
        if (grade < 0 || grade > 20) {
            toast.error("Grade must be 0–20");
            return;
        }
        setLoading(true);
        try {
            const res = await evaluateSession(session.id, { grade, note, isFinalSession: isFinal });
            if (res.success) {
                toast.success(existing ? "Evaluation updated!" : "Session evaluated!");
                onSuccess();
            } else {
                toast.error(res.message || "Failed to submit");
            }
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22, type: "spring", bounce: 0.18 }}
            className="bg-white dark:bg-slate-800/70 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md"
        >
            {/* ── Grade picker ── */}
            <div className="px-4 pt-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Grade / 20
                    </span>
                    <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[13px] font-black ${gs.color} ${gs.bg} ${gs.border}`}
                    >
                        {grade}
                        <span className="font-normal opacity-60">/20</span>
                        <span className={`text-[9px] font-bold ml-1 opacity-70`}>· {gs.label}</span>
                    </div>
                </div>

                {/* Number buttons */}
                <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 21 }, (_, i) => i).map((n) => (
                        <button
                            key={n}
                            onClick={() => setGrade(n)}
                            className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all duration-100 ${grade === n
                                    ? `bg-indigo-600 text-white shadow-sm scale-110 ring-2 ring-indigo-300/50`
                                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                        animate={{ width: `${(grade / 20) * 100}%` }}
                        transition={{ duration: 0.25 }}
                        className={`h-full rounded-full bg-linear-to-r ${gs.bar}`}
                    />
                </div>
            </div>

            {/* ── Feedback textarea ── */}
            <div className="px-4 py-3">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write your clinical feedback…"
                    rows={3}
                    className="w-full bg-transparent text-[13px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none leading-relaxed"
                />
            </div>

            {/* ── Footer ── */}
            <div className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-slate-50 dark:border-slate-700/40 pt-3">
                <button
                    type="button"
                    onClick={() => setIsFinal(!isFinal)}
                    className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${isFinal
                            ? "border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                            : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-500"
                        }`}
                >
                    <Sparkles size={10} />
                    Final session
                </button>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onCancel}
                        className="my-btn-danger-outline px-3"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="my-btn px-3"
                    >
                        {loading ? <Loader2 size={11} className="animate-spin" /> : <Send size={11} />}
                        {loading ? "Saving…" : existing ? "Update" : "Post"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}