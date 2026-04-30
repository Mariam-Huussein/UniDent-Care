import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

export default function OdontogramEmptyState() {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4"
            >
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/20 border border-indigo-100 dark:border-indigo-800/40 flex items-center justify-center shadow-sm">
                    <Stethoscope size={26} className="text-indigo-400 dark:text-indigo-500" />
                </div>
                <div className="max-w-xs">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        No Diagnosis Recorded
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 leading-relaxed">
                        No dental diagnosis has been submitted for this case yet. The chart will populate once a diagnosis plan is recorded.
                    </p>
                </div>
            </motion.div>
        </>
    )
}