"use client";

import { motion } from "framer-motion";
import { Stethoscope, GraduationCap, Phone, Mail, User } from "lucide-react";
import { DoctorData } from "@/types/getUser.type";
import { UniversityLookup } from "@/server/getUniversities.action";

interface DoctorProfileViewProps {
  doctor: DoctorData & { universityName?: string; phoneNumber?: string; userName?: string };
  t: any;
  universities?: UniversityLookup[];
}

export function DoctorProfileView({ doctor, t, universities = [] }: DoctorProfileViewProps) {
  const getUniversityName = () => {
    if (doctor?.universityId && universities.length > 0) {
      const match = universities.find(u => u.id === doctor.universityId || u.id === String(doctor.universityId));
      if (match) return match.name;
    }
    return doctor?.universityName || "N/A";
  };

  const fields = [
    { icon: Stethoscope, color: "blue",   label: t?.profile?.specialty   || "Specialty",   value: doctor?.specialty   || "General" },
    { icon: GraduationCap, color: "indigo", label: t?.profile?.university || "University",  value: getUniversityName() },
    { icon: Phone,        color: "emerald", label: t?.profile?.phoneNumber || "Phone",      value: doctor?.phoneNumber || "—" },
    { icon: Mail,         color: "violet",  label: t?.profile?.email       || "Email",      value: doctor?.email       || "—" },
    { icon: User,         color: "amber",   label: t?.profile?.username    || "Username",   value: doctor?.userName    || "—" },
  ];

  const colorMap: Record<string, string> = {
    blue:   "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    emerald:"bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
    amber:  "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          {t?.profile?.professionalInfo || "Professional Information"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {fields.map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${colorMap[color]}`}>
                <Icon size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{label}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
