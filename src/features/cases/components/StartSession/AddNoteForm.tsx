"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, Globe, Image as ImageIcon, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AddNoteFormProps {
    onSubmit: (note: string, isPrivate: boolean, imageUrl?: string) => Promise<void>;
    isLoading: boolean;
}

export default function AddNoteForm({ onSubmit, isLoading }: AddNoteFormProps) {
    const [note, setNote] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [showImageField, setShowImageField] = useState(false);

    const canSubmit = note.trim().length > 0 && !isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        await onSubmit(note.trim(), isPrivate, imageUrl.trim() || undefined);
        setNote("");
        setImageUrl("");
        setShowImageField(false);
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 sm:p-5 shadow-sm space-y-4"
        >
            {/* Label */}
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Send size={14} className="text-indigo-500" />
                Add Clinical Note
            </h4>

            {/* Textarea */}
            <Textarea
                placeholder="Write your clinical observations, treatment notes, or findings..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="resize-none text-sm min-h-[80px] bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500"
            />

            {/* Options Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Privacy Toggle */}
                <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isPrivate
                            ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/40 dark:hover:bg-rose-900/30"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40 dark:hover:bg-emerald-900/30"
                    }`}
                >
                    {isPrivate ? <Lock size={12} /> : <Globe size={12} />}
                    {isPrivate ? "Private Note" : "Public Note"}
                </button>

                {/* Image toggle */}
                <button
                    type="button"
                    onClick={() => setShowImageField(!showImageField)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                    <ImageIcon size={13} />
                    Attach Image
                    {showImageField ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
            </div>

            {/* Image URL Field */}
            <AnimatePresence>
                {showImageField && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <input
                            type="url"
                            placeholder="Paste image URL here..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/20 transition-all"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.01 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 cursor-pointer"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving Note...
                    </>
                ) : (
                    <>
                        <Send size={15} />
                        Add Note
                    </>
                )}
            </motion.button>
        </motion.form>
    );
}
