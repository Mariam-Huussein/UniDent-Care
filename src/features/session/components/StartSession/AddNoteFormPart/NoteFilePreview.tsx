import { AnimatePresence, motion } from "framer-motion";
import { FileImage, X } from "lucide-react";

export const NoteFilePreview = ({ files, onRemove }: { files: File[], onRemove: (i: number) => void }) => (
    <AnimatePresence>
        {files.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-2 p-3 rounded-xl bg-white border border-slate-200">
                {files.map((f, i) => (
                    <span key={f.name} className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg px-2.5 py-1">
                        <FileImage size={11} /> <span className="truncate max-w-[120px]">{f.name}</span>
                        <button type="button" onClick={() => onRemove(i)} className="hover:text-rose-500"><X size={10} /></button>
                    </span>
                ))}
            </motion.div>
        )}
    </AnimatePresence>
);