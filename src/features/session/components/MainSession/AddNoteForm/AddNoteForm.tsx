"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, X, FileImage, UploadCloud, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { NoteFilePreview } from "./Parts/NoteFilePreview";
import { NoteDropZone } from "./Parts/NoteDropZone";
import { NoteErrorMessage } from "./Parts/NoteErrorMessage";
import { NoteCharacterCounter } from "./Parts/NoteCharacterCounter";
import { useAddNote } from "../../../hooks/useAddNote";

interface AddNoteFormProps {
    onSubmit: (note: string, files?: File[]) => Promise<void>;
    isLoading: boolean;
}

export default function AddNoteForm({ onSubmit, isLoading }: AddNoteFormProps) {
    const { state, refs, actions } = useAddNote(onSubmit, isLoading);

    return (
        <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={actions.handleFormSubmit}
            className="bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4 sm:p-5 shadow-sm space-y-4"
        >
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Send size={14} className="text-indigo-500" /> Add Clinical Note
            </h4>

            {/* Input Section */}
            <div className="space-y-1.5">
                <div className="relative">
                    <Textarea
                        placeholder="Write your clinical observations..."
                        value={state.note}
                        onChange={(e) => {
                            actions.setNote(e.target.value);
                            if (state.noteError || e.target.value.trim().length >= 10) actions.validateNote(e.target.value);
                        }}
                        onBlur={() => actions.validateNote(state.note)}
                        rows={3}
                        className={`resize-none text-sm min-h-[80px] bg-slate-50 dark:bg-slate-900/50 border transition-all ${state.noteError ? "border-rose-400 focus:ring-rose-100" : "border-slate-200 focus:ring-indigo-100"
                            }`}
                    />
                    <NoteCharacterCounter current={state.note.length} max={state.MAX_CHARS} />
                </div>
                <NoteErrorMessage message={state.noteError} />
            </div>

            {/* Drag & Drop Section */}
            <NoteDropZone
                isDragging={state.isDragging}
                onAction={() => refs.fileInputRef.current?.click()}
                actions={actions}
            />

            <input
                ref={refs.fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => actions.addFiles(e.target.files)}
            />

            {/* Files Preview */}
            <NoteFilePreview files={state.files} onRemove={actions.removeFile} />

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={!state.canSubmit}
                className="relative cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 disabled:opacity-40 shadow-lg shadow-indigo-200/60"
            >
                {isLoading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Send size={15} /> Add Note {state.files.length > 0 && `(+${state.files.length})`}</>}
            </motion.button>
        </motion.form>
    );
}
