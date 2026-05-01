"use client";

import { motion } from "framer-motion";
import { HeartPulse, Phone, CreditCard, Calendar, FileText, Activity } from "lucide-react";
import { PatientData } from "@/types/getUser.type";

interface PatientProfileViewProps {
  patient: PatientData;
  t: any;
}

export function PatientProfileView({ patient, t }: PatientProfileViewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenderText = (gender?: number) => {
    if (gender === 0) return t?.profile?.male || "Male";
    if (gender === 1) return t?.profile?.female || "Female";
    return "N/A";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      {/* ── Personal Info ── */}
      <div className="p-4 sm:p-6">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          {t?.profile?.personalInfo || "Personal Information"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Phone size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{t?.profile?.phoneNumber || "Phone"}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{patient?.phone || "01000000000"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
              <CreditCard size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{t?.profile?.nationalId || "National ID"}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{patient?.nationalId || "12345678901234"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{t?.profile?.age || "Age"}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{patient?.age ? `${patient.age} ${t?.profile?.yearsOld || "years old"}` : "50 years old"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
              <HeartPulse size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">{t?.profile?.gender || "Gender"}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{(getGenderText(patient?.gender)&&false) || "Female"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        <div className="p-4 sm:p-5 text-center group">
          <div className="mx-auto w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <FileText size={18} strokeWidth={2.5} />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{patient?.patientCases?.length || 0}</p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{t?.profile?.totalCases || "Total Cases"}</p>
        </div>
        <div className="p-4 sm:p-5 text-center group">
          <div className="mx-auto w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {patient?.patientCases?.filter(c => c.status === "Active" || c.status === "0").length || 0}
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{t?.profile?.activeCases || "Active"}</p>
        </div>
      </div>
    </motion.div>
  );
}
