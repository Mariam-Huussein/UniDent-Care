import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const NoteErrorMessage = ({ message }: { message: string | null }) => (
    <AnimatePresence>
        {message && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
                <AlertCircle size={12} /> {message}
            </motion.p>
        )}
    </AnimatePresence>
);
