"use client";

import { motion } from "framer-motion";
import { Stethoscope, GraduationCap, Users, Activity, CheckCircle2 } from "lucide-react";
import { DoctorData } from "@/types/getUser.type";
import { UniversityLookup } from "@/server/getUniversities.action";

interface DoctorProfileViewProps {
  doctor: DoctorData;
  t: any;
  universities?: UniversityLookup[];
}

export function DoctorProfileView({ doctor, t, universities = [] }: DoctorProfileViewProps) {
  const getUniversityName = () => {
    if (doctor?.universityId && universities.length > 0) {
      const match = universities.find(u => u.id === doctor.universityId || u.id === String(doctor.universityId));
      if (match) return match.name;
    }
    return "N/A";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      {/* ── Professional Info ── */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          {t?.profile?.professionalInfo || "Professional Information"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Stethoscope size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{t?.profile?.specialty || "Specialty"}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{doctor?.specialty || "General"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <GraduationCap size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{t?.profile?.university || "University"}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{getUniversityName()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        <div className="p-4 sm:p-5 text-center group">
          <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Users size={18} strokeWidth={2.5} />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{doctor?.totalStudents || 0}</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{t?.profile?.totalStudents || "Students"}</p>
        </div>
        <div className="p-4 sm:p-5 text-center group">
          <div className="mx-auto w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{doctor?.pendingRequests || 0}</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{t?.profile?.pendingRequests || "Pending"}</p>
        </div>
        <div className="p-4 sm:p-5 text-center group">
          <div className="mx-auto w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={18} strokeWidth={2.5} />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{doctor?.approvedRequests || 0}</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{t?.profile?.approvedRequests || "Approved"}</p>
        </div>
      </div>
    </motion.div>
  );
}
