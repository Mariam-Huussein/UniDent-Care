import { useState, useRef } from "react";
import { addNoteSchema } from "@/features/cases/schemas/addNoteSchema";

export function useAddNote(onSubmit: (note: string, files?: File[]) => Promise<void>, isLoading: boolean) {
    const [note, setNote] = useState("");
    const [noteError, setNoteError] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_CHARS = 2000;
    const canSubmit = note.trim().length >= 10 && note.trim().length <= MAX_CHARS && !isLoading;

    const validateNote = (value: string) => {
        const result = addNoteSchema.safeParse({ note: value.trim() });
        setNoteError(!result.success ? result.error.issues[0]?.message ?? null : null);
    };

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const next = Array.from(incoming);
        setFiles((prev) => {
            const names = new Set(prev.map((f) => f.name));
            return [...prev, ...next.filter((f) => !names.has(f.name))];
        });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        validateNote(note);
        if (!canSubmit) return;
        await onSubmit(note.trim(), files.length > 0 ? files : undefined);
        setNote("");
        setNoteError(null);
        setFiles([]);
    };

    const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

    return {
        state: { note, noteError, files, isDragging, MAX_CHARS, isLoading, canSubmit },
        refs: { fileInputRef },
        actions: { 
            setNote, 
            validateNote, 
            addFiles, 
            handleFormSubmit, 
            removeFile,
            setIsDragging 
        }
    };
}