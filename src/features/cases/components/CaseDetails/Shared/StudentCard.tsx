import { motion } from "framer-motion";
import { GraduationCap, Phone, Mail, MessageCircle } from "lucide-react";
import { PatientCase } from "../../../types/CaseDetails.types";

export default function StudentCard({ student, status }: { student: NonNullable<PatientCase["student"]>, status: PatientCase["status"] }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-3 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all relative overflow-hidden"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <GraduationCap size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">{student.name}</p>
                        {status === "completed" && (
                            <span className="shrink-0 text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Completed</span>
                        )}
                        {status === "in-progress" && (
                            <span className="shrink-0 text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded uppercase tracking-wider">In Progress</span>
                        )}
                        {status === "diagnosis" && (
                            <span className="shrink-0 text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Diagnosis</span>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{student.university} · Level {student.level}</p>
                </div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <p className="flex items-center gap-2"><Phone size={11} className="text-slate-400 dark:text-slate-500" />{student.phone}</p>
                <p className="flex items-center gap-2"><Mail size={11} className="text-slate-400 dark:text-slate-500" />{student.email}</p>
            </div>
            <div className="flex gap-2 pt-1">
                <button className="flex-1 !text-xs py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center gap-1.5"><Phone size={12} /> Call</button>
                <button className="flex-1 !text-xs py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"><MessageCircle size={12} /> Message</button>
            </div>
        </motion.div>
    );
}
