"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Star } from "lucide-react";

export default function EvaluationCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-2xl bg-violet-50 dark:bg-violet-900/10 border border-violet-200/60 dark:border-violet-800/50 p-4 space-y-2"
        >
            <div className="flex items-center gap-2">
                <ClipboardCheck size={14} className="text-violet-600 dark:text-violet-400" />
                <p className="text-[11px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">
                    Evaluation Required
                </p>
            </div>
            <p className="text-xs text-violet-600 dark:text-violet-300">
                A session is pending your evaluation. Please review and provide your feedback.
            </p>
            <button className="my-btn w-full py-2.5 text-sm group bg-violet-600 hover:bg-violet-700 border-violet-600">
                <Star size={14} className="group-hover:scale-110 transition-transform" />
                Evaluate Session
            </button>
        </motion.div>
    );
}
