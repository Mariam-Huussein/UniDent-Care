import { motion } from "framer-motion";

export default function DetailCard({ label, value }: { label: string; value: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            className="bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-700/50 rounded-xl px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200/60 dark:hover:border-slate-700 transition-all duration-200"
        >
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</p>
        </motion.div>
    );
}
