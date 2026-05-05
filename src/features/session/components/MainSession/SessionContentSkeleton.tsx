import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function SessionContentSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 -m-6 lg:-m-10 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8 transition-colors duration-300">
                <div className="max-w-[1200px] mx-auto flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Loader2 size={28} className="text-white animate-spin" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Loading Session Data</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Fetching session details...</p>
                        </div>
                    </motion.div>
                </div>
        </div>
    );
}