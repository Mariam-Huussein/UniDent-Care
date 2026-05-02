"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, X, FileImage, UploadCloud, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { addNoteSchema } from "@/features/cases/schemas/addNoteSchema";

interface AddNoteFormProps {
    onSubmit: (note: string, files?: File[]) => Promise<void>;
    isLoading: boolean;
}

export default function AddNoteForm({ onSubmit, isLoading }: AddNoteFormProps) {
    const [note, setNote] = useState("");
    const [noteError, setNoteError] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_CHARS = 2000;
    const trimmed = note.trim();
    const isValid = trimmed.length >= 10 && trimmed.length <= MAX_CHARS;
    const canSubmit = isValid && !isLoading;

    const validateNote = (value: string) => {
        const result = addNoteSchema.safeParse({ note: value.trim() });
        if (!result.success) {
            setNoteError(result.error.issues[0]?.message ?? null);
        } else {
            setNoteError(null);
        }
    };

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const next = Array.from(incoming);
        setFiles((prev) => {
            const names = new Set(prev.map((f) => f.name));
            return [...prev, ...next.filter((f) => !names.has(f.name))];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        validateNote(note);
        if (!canSubmit) return;
        await onSubmit(note.trim(), files.length > 0 ? files : undefined);
        setNote("");
        setNoteError(null);
        setFiles([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        addFiles(e.target.files);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 sm:p-5 shadow-sm space-y-4"
        >
            {/* Label */}
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Send size={14} className="text-indigo-500" />
                Add Clinical Note
            </h4>

            {/* Textarea */}
            <div className="space-y-1.5">
                <div className="relative">
                    <Textarea
                        placeholder="Write your clinical observations, treatment notes, or findings..."
                        value={note}
                        onChange={(e) => {
                            setNote(e.target.value);
                            if (noteError || e.target.value.trim().length >= 10) {
                                validateNote(e.target.value);
                            }
                        }}
                        onBlur={() => validateNote(note)}
                        rows={3}
                        className={`resize-none text-sm min-h-[80px] bg-slate-50 dark:bg-slate-900/50
                            border focus:ring-2 focus:ring-offset-0 transition-all
                            ${ noteError
                                ? "border-rose-400 dark:border-rose-600 focus:border-rose-400 focus:ring-rose-100 dark:focus:ring-rose-900/20"
                                : "border-slate-200 dark:border-slate-700 focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/20"
                            }`}
                    />
                    {/* Character counter */}
                    {note.length > 0 && (
                        <span className={`absolute bottom-2.5 right-3 text-[10px] font-mono tabular-nums select-none transition-colors ${
                            note.length > MAX_CHARS
                                ? "text-rose-500"
                                : note.length > MAX_CHARS * 0.8
                                    ? "text-amber-500"
                                    : "text-slate-400 dark:text-slate-500"
                        }`}>
                            {note.length}/{MAX_CHARS}
                        </span>
                    )}
                </div>

                {/* Inline error */}
                <AnimatePresence>
                    {noteError && (
                        <motion.p
                            key="note-error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-1.5 text-xs font-medium text-rose-500 dark:text-rose-400"
                        >
                            <AlertCircle size={12} />
                            {noteError}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Drag & Drop Zone ── */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative flex flex-col items-center gap-2.5 rounded-2xl border-2 border-dashed
                    px-6 py-5 cursor-pointer select-none transition-all duration-200
                    ${isDragging
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 scale-[1.01]"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/20"
                    }
                `}
            >
                {/* icon */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
                    ${isDragging
                        ? "bg-indigo-100 dark:bg-indigo-900/50"
                        : "bg-white dark:bg-slate-800 shadow-sm group-hover:bg-indigo-50"
                    }`}>
                    <UploadCloud size={22} className={isDragging ? "text-indigo-600" : "text-indigo-400"} />
                </div>

                {/* text */}
                <div className="text-center leading-snug">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {isDragging ? "Release to attach files" : "Drag & drop files here"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        or{" "}
                        <span className="text-indigo-500 dark:text-indigo-400 underline underline-offset-2 font-semibold">
                            click to browse
                        </span>
                        {" "}· Images &amp; Videos
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* ── Attached files ── */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm">
                            {files.map((f, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.15 }}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 rounded-lg px-2.5 py-1 max-w-[180px]"
                                >
                                    <FileImage size={11} className="shrink-0" />
                                    <span className="truncate">{f.name}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                        className="shrink-0 text-indigo-400 hover:text-rose-500 transition-colors cursor-pointer ml-0.5"
                                    >
                                        <X size={10} />
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Submit ── */}
            <motion.button
                type="submit"
                disabled={!canSubmit}
                whileHover={canSubmit ? { scale: 1.01 } : {}}
                whileTap={canSubmit ? { scale: 0.98 } : {}}
                className="relative w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white
                    bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700
                    shadow-lg shadow-indigo-200/60 dark:shadow-indigo-900/40
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                    transition-all duration-200 cursor-pointer overflow-hidden"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving Note…
                    </>
                ) : (
                    <>
                        <Send size={15} />
                        Add Note
                        {files.length > 0 && (
                            <span className="absolute right-4 text-[10px] bg-white/20 rounded-md px-1.5 py-0.5 font-bold tracking-wide">
                                +{files.length}
                            </span>
                        )}
                    </>
                )}
            </motion.button>
        </motion.form>
    );

    function removeFile(i: number) {
        setFiles((prev) => prev.filter((_, idx) => idx !== i));
    }
}
