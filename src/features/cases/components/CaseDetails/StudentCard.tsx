import { motion } from "framer-motion";
import { GraduationCap, Phone, Mail, MessageCircle } from "lucide-react";
import { PatientCase } from "../../types/CaseDetails.types";

export default function StudentCard({ student, status }: { student: NonNullable<PatientCase["student"]>, status: PatientCase["status"] }) {
    return (
        <motion.div
            whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-4 space-y-3 shadow-sm relative overflow-hidden"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
                    <GraduationCap size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-gray-800 truncate pr-2">{student.name}</p>
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
                    <p className="text-[11px] text-gray-400 truncate">{student.university} · Level {student.level}</p>
                </div>
            </div>
            <div className="space-y-1.5 text-xs text-gray-500">
                <p className="flex items-center gap-2"><Phone size={11} className="text-gray-400" />{student.phone}</p>
                <p className="flex items-center gap-2"><Mail size={11} className="text-gray-400" />{student.email}</p>
            </div>
            <div className="flex gap-2 pt-1">
                <button className="my-btn flex-1 !text-xs py-2.5"><Phone size={12} /> Call</button>
                <button className="my-btn-outline flex-1 !text-xs py-2.5"><MessageCircle size={12} /> Message</button>
            </div>
        </motion.div>
    );
}
